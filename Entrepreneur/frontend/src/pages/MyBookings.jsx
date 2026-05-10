import React, { useState, useEffect } from "react";

// shadcn
import { Card, CardContent } from "@/components/ui/card";

export default function MyBookings({ userEmail }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/freelancers/user-bookings/${userEmail}`
        );
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        // Error silently
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userEmail]);

  // 🔥 STATUS STYLE
  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      default:
        return "bg-red-500/10 text-red-400 border border-red-500/20";
    }
  };

  return (
    <div className="min-h-screen relative px-6 py-12">

      {/* 🔥 GRID BACKGROUND */}
      <div className="grid-background"></div>

      {/* 🔥 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/90 z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          My Bookings
        </h1>

        {/* LOADING */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-white/5 animate-pulse"
              ></div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && bookings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No bookings yet 🚀
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Start hiring freelancers to see your bookings here.
            </p>
          </div>
        )}

        {/* BOOKINGS LIST */}
        <div className="grid gap-6">
          {bookings.map((b) => (
            <Card
              key={b._id}
              className="bg-white/5 border border-white/10 backdrop-blur hover:scale-[1.01] transition"
            >
              <CardContent className="p-6 space-y-3">

                {/* NAME */}
                <h2 className="text-lg font-semibold text-white">
                  {b.freelancer?.name || "Freelancer"}
                </h2>

                {/* PROJECT */}
                <p className="text-sm text-gray-400">
                  {b.projectDetails}
                </p>

                {/* PRICE */}
                <p className="text-sm text-gray-300">
                  Advance: ₹{b.advanceFee}
                </p>

                {/* STATUS BADGE */}
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                    b.status
                  )}`}
                >
                  {b.status}
                </span>

              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}