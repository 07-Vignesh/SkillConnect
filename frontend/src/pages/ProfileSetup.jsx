import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function ProfileSetup() {
  const navigate = useNavigate();
  const { user } = useUser(); // 👈 get logged-in user from Clerk

  // Basic freelancer info
  const [name, setName] = useState(user?.firstName || "");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  // Services array (only title + description)
  const [services, setServices] = useState([{ title: "", description: "" }]);

  const [loading, setLoading] = useState(false);

  // Handle dynamic service input changes
  const handleChange = (index, e) => {
    const newServices = [...services];
    newServices[index][e.target.name] = e.target.value;
    setServices(newServices);
  };

  const addService = () => setServices([...services, { title: "", description: "" }]);

  // Submit profile to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
   const res = await fetch("http://localhost:5000/api/freelancers", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name,
    email: user?.emailAddresses[0]?.emailAddress,
    city,
    pincode,
    category,
    price,
    services,
  }),
});

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save freelancer profile");
      }

      console.log("✅ Saved freelancer profile:", data);
      navigate("/freelancer-dashboard");
    } catch (error) {
      console.error("❌ Error saving profile:", error);
      alert("Something went wrong while saving your profile!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-10 px-4">
      <div className="card w-full max-w-2xl bg-base-100 shadow-2xl border rounded-2xl p-6 sm:p-8">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            🎯 Setup Your Professional Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              placeholder="Category (e.g., Web Development)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            <input
              type="number"
              placeholder="Base Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input input-bordered w-full"
              required
            />

            {/* Services */}
            {services.map((service, index) => (
              <div
                key={index}
                className="p-5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm space-y-3"
              >
                <input
                  type="text"
                  name="title"
                  placeholder="Service Title"
                  value={service.title}
                  onChange={(e) => handleChange(index, e)}
                  className="input input-bordered w-full"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Service Description"
                  value={service.description}
                  onChange={(e) => handleChange(index, e)}
                  className="textarea textarea-bordered w-full"
                  rows="3"
                  required
                />
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={addService}
                className="btn btn-outline btn-success"
              >
                ➕ Add Another Service
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
              disabled={loading}
            >
              {loading ? "⏳ Saving..." : "🚀 Finish Setup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
