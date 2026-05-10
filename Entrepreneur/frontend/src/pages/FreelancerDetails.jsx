import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import freelancersData from "../datas/freelancers.json";

// shadcn
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FreelancerDetails() {
  const { id } = useParams();
  const { user } = useUser();

  const [freelancer, setFreelancer] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH =================
useEffect(() => {
  const fetchFreelancer = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/freelancers/${id}`
      );
      const data = await res.json();

      if (data && data._id) {
        setFreelancer(data);
      } else {
        throw new Error("Not in DB");
      }

    } catch (err) {
      const found = freelancersData.find(
        (freelancer) => freelancer.id === id || freelancer._id === id
      );

      if (found) {
        setFreelancer(found);
        setError("");
      } else {
        setError("Freelancer not found");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchFreelancer();
}, [id]);

  // ================= BOOK =================
  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please login first");
      return;
    }

    const projectDetails = e.target.details.value;
    const advanceFee = 49;

    if (!projectDetails) {
      setError("All fields required");
      return;
    }

    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        freelancerId: id,
        clientId: user.id,
        clientName: user.fullName,
        clientEmail: user.emailAddresses[0].emailAddress,
        projectDetails,
        advanceFee,
        status: "pending",
      }),
    });

    const data = await res.json();
    setBooking(data);
  };

  // ================= CANCEL =================
  const cancelBooking = async () => {
    await fetch(
      `http://localhost:5000/api/bookings/${booking._id}/cancel`,
      { method: "PUT" }
    );
    setBooking(null);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );

  if (!freelancer)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Freelancer not found
      </div>
    );

  return (
    <div className="min-h-screen relative overflow-hidden px-6 py-12 text-foreground">

      {/* 🔥 BACKGROUND */}
      <div className="grid-background"></div>
      <div className="absolute inset-0 bg-black/90 z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {/* ================= LEFT (PROFILE) ================= */}
        <div className="md:col-span-2 space-y-6">

          <Card className="bg-white/5 border border-white/10 backdrop-blur">
            <CardContent className="pt-6 space-y-4">

              <h1 className="text-3xl font-bold text-white">
                {freelancer.name}
              </h1>

              <p className="text-gray-400">
                {freelancer.category}
              </p>

              <p className="text-lg font-semibold text-white">
                ₹{freelancer.pricing?.amount || freelancer.price}
              </p>

              <p className="text-sm text-gray-400">
  {freelancer.location?.city || freelancer.city} •{" "}
  {freelancer.location?.pincode || freelancer.pincode}
</p>

              {/* 🔥 EXTRA UI */}
              <div className="flex gap-4 mt-4 text-sm text-gray-400">
                <span>⭐ 4.8 Rating</span>
                <span>✔ Verified</span>
                <span>⚡Fast Delivery</span>
              </div>

            </CardContent>
          </Card>

          {/* 🔥 DESCRIPTION */}
          <Card className="bg-white/5 border border-white/10 backdrop-blur">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-white mb-3">
                About Freelancer
              </h2>

              <p className="text-gray-400">
                This freelancer specializes in delivering high-quality work with
                fast turnaround and excellent communication. Perfect for both
                small and large projects.
              </p>
            </CardContent>
          </Card>

        </div>

        {/* ================= RIGHT (BOOKING PANEL) ================= */}
        <div>

          {!booking ? (
            <Card className="sticky top-24 bg-white/5 border border-white/10 backdrop-blur">
              <CardContent className="pt-6 space-y-4">

                <h2 className="text-xl font-semibold text-white">
                  Book this Freelancer
                </h2>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <form onSubmit={handleBooking} className="space-y-4">

                  <textarea
                    name="details"
                    placeholder="Describe your project..."
                    className="w-full p-3 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-gray-500"
                  />

                  <div className="w-full p-3 rounded-md bg-white/5 border border-white/10 text-white">
                    Advance Fee: <span className="font-semibold">₹49</span>
                  </div>

                  <Button className="w-full text-white">
                    Continue & Pay
                  </Button>

                </form>

              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/5 border border-white/10 backdrop-blur text-center">
              <CardContent className="pt-6 space-y-3">

                <h2 className="text-green-400 text-xl font-bold">
                  🎉 Booking Confirmed
                </h2>

                <p className="text-gray-300">
                  You booked <strong>{freelancer.name}</strong>
                </p>

                <p className="text-white">
                  Advance Paid: ₹{booking.advanceFee}
                </p>

                <Button
                  variant="destructive"
                  onClick={cancelBooking}
                >
                  Cancel Booking
                </Button>

              </CardContent>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
}