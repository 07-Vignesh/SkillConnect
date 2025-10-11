import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

function UserBookings() {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const email = user.emailAddresses[0].emailAddress;
        const res = await fetch(`http://localhost:5000/api/bookings/client/${email}`);
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [user]);

  // ✅ Submit Rating
  const handleRate = async (bookingId, ratingValue) => {
    const rating = Number(ratingValue); // ensure it's numeric

    if (isNaN(rating) || rating < 1 || rating > 5) {
      alert("Please choose a rating between 1 and 5");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/rate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit rating");

      // ✅ Update UI immediately
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, rating, status: "completed" } : b
        )
      );

      alert(`⭐ You rated this freelancer ${rating}/5`);
    } catch (err) {
      console.error("Rating failed:", err);
      alert("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white p-4 rounded-lg shadow border transition hover:shadow-md"
            >
              <p>
                <strong>Freelancer ID:</strong> {b.freelancerId}
              </p>
              <p>
                <strong>Project:</strong> {b.projectDetails}
              </p>
              <p>
                <strong>Advance Fee:</strong> ₹{b.advanceFee}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    b.status === "accepted"
                      ? "text-green-600"
                      : b.status === "pending"
                      ? "text-yellow-500"
                      : "text-gray-600"
                  }`}
                >
                  {b.status}
                </span>
              </p>

              {/* ⭐ Rating UI */}
              {b.status === "accepted" && !b.rating && (
                <div className="mt-3">
                  <p className="text-gray-700 mb-1">Rate this freelancer:</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(b._id, star)}
                        className="text-2xl hover:scale-110 transition-transform"
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {b.rating && (
                <p className="mt-2 text-green-600 font-semibold">
                  ⭐ You rated: {b.rating} / 5
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserBookings;
