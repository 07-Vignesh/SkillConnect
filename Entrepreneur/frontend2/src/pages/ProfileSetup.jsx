import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { useUser } from "@clerk/clerk-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [name, setName] = useState(user?.firstName || "");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [services, setServices] = useState([{ title: "", description: "" }]);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, e) => {
    const newServices = [...services];
    newServices[index][e.target.name] = e.target.value;
    setServices(newServices);
  };

  const addService = () => {
    setServices([...services, { title: "", description: "" }]);
  };

  const normalizeCategory = (name) => {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const normalizedCategory = normalizeCategory(category);

      const res = await fetch(`${BACKEND_URL}/api/freelancers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: user?.emailAddresses[0]?.emailAddress,
          city,
          pincode,
          category: normalizedCategory,
          price,
          services,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Save freelancer id so dashboard can fetch it without re-login
      if (data._id) {
        localStorage.setItem("freelancerId", data._id);
      }

      await fetch(`${BACKEND_URL}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: normalizedCategory }),
      });

      navigate("/freelancer-dashboard");

    } catch (err) {
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-10">

      {/* 🔥 BACKGROUND */}
      <div className="grid-background"></div>
      <div className="absolute inset-0 bg-black/90 -z-10"></div>

      <Card className="w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl">
        <CardContent className="pt-6 space-y-6">

          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Setup Your Profile 
            </h2>
            <p className="text-gray-400">
              Showcase your skills and start earning
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 text-white">

            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>

            <Input
              placeholder="Category (e.g., Web Development)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Base Price ₹"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            {/* SERVICES */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">
                Your Services
              </h3>

              {services.map((service, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2 hover:border-primary transition"
                >
                  <Input
                    name="title"
                    placeholder="Service Title"
                    value={service.title}
                    onChange={(e) => handleChange(index, e)}
                  />

                  <textarea
                    name="description"
                    placeholder="Service Description"
                    value={service.description}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full rounded-md px-3 py-2 bg-transparent text-sm border border-white/10 focus:ring-1 focus:ring-primary outline-none text-white placeholder:text-gray-400"
                  />
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={addService}
              className="w-full"
            >
              + Add Another Service
            </Button>

            <Button type="submit" className="w-full">
              {loading ? "Saving..." : "Finish Setup"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}