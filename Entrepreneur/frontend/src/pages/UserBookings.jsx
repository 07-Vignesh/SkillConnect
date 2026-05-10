import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

// shadcn
import { Card, CardContent } from "@/components/ui/card";

export default function UserBookings() {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const email = user.emailAddresses[0].emailAddress;

        const res = await fetch(
          `http://localhost:5000/api/bookings/client/${email}`
        );

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        // Error silently
      }
    };

    fetchBookings();
  }, [user]);

  const handleRate = async (bookingId, ratingValue) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/rate`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating: ratingValue }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, rating: ratingValue, status: "completed" }
            : b
        )
      );
    } catch (err) {
      alert("Rating failed");
    }
  };

  return (
    <div className="min-h-screen relative px-6 py-16">

      {/* 🔥 GRID */}
      <div className="grid-background"></div>

      {/* 🔥 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/90 -z-10"></div>

      {/* HEADER */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white">
          My Bookings
        </h1>
        <p className="text-gray-400 mt-2">
          Track and manage your hired freelancers
        </p>
      </div>

      {/* EMPTY */}
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">
          No bookings yet.
        </p>
      ) : (

        <div className="grid gap-6 max-w-4xl mx-auto">

          {bookings.map((b) => (
            <Card
              key={b._id}
              className="bg-white/5 border border-white/10 backdrop-blur-lg hover:shadow-xl transition"
            >
              <CardContent className="pt-6 space-y-4">

                {/* TOP */}
                <div className="flex justify-between items-center">

                  <h2 className="text-lg font-semibold text-white">
                    Project Booking
                  </h2>

                  {/* STATUS BADGE */}
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      b.status === "accepted"
                        ? "bg-green-500/20 text-green-400"
                        : b.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                {/* DETAILS */}
                <p className="text-sm text-gray-400">
                  <span className="text-white font-medium">
                    Freelancer ID:
                  </span>{" "}
                  {b.freelancerId}
                </p>

                <p className="text-sm text-gray-400">
                  {b.projectDetails}
                </p>

                <p className="text-lg font-bold text-primary">
                  ₹{b.advanceFee}
                </p>

                {/* ⭐ RATING INPUT */}
                {b.status === "accepted" && !b.rating && (
                  <div>
                    <p className="text-sm text-gray-300 mb-2">
                      Rate this freelancer:
                    </p>

                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => handleRate(b._id, star)}
                          className="text-2xl cursor-pointer hover:scale-125 transition"
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ⭐ RATED */}
                {b.rating && (
                  <p className="text-green-400 font-semibold">
                    ⭐ You rated: {b.rating} / 5
                  </p>
                )}

              </CardContent>
            </Card>
          ))}

        </div>
      )}
    </div>
  );
}