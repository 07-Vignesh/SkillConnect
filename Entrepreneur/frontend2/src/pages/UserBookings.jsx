import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Star } from "lucide-react";

export default function UserBookings() {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const email = user.emailAddresses[0].emailAddress;
        const res = await fetch(`http://localhost:5000/api/bookings/client/${email}`);
        const data = await res.json();
        setBookings(data);
      } catch {} finally { setLoading(false); }
    };
    fetchBookings();
  }, [user]);

  const handleRate = async (bookingId, ratingValue) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/rate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: ratingValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, rating: ratingValue, status: "completed" } : b));
    } catch { alert("Rating failed"); }
  };

  const statusStyle = (s) => ({
    accepted:  { color: "#4ade80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.25)" },
    pending:   { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)" },
    completed: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)" },
  }[s] || { color: "#9ca3af", bg: "rgba(156,163,175,0.1)", border: "rgba(156,163,175,0.2)" });

  return (
    <div className="min-h-screen relative overflow-hidden px-6 py-16" style={{ backgroundColor: "#080810" }}>
      <div className="grid-background" />
      <div className="bg-bloom-top" />
      <div className="bg-bloom-bottom" />
      <div className="bg-noise" />

      <div className="page-content max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="badge-violet mb-4 inline-flex">My Activity</span>
          <h1 className="text-4xl font-extrabold text-white mb-3">My Bookings</h1>
          <p className="text-gray-400">Track and manage your hired freelancers</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card p-14 text-center text-gray-500">
            <div className="text-5xl mb-4">📋</div>
            <p>No bookings yet. Hire a freelancer to get started!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map(b => {
              const st = statusStyle(b.status);
              return (
                <div key={b._id} className="glass-card p-7">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="text-lg font-bold text-white">Project Booking</h2>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                      style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                      {b.status}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">{b.projectDetails}</p>
                  <p className="text-xs text-gray-500 mb-4">Freelancer ID: {b.freelancerId}</p>

                  <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="text-xl font-extrabold text-white">₹{b.advanceFee} <span className="text-xs font-normal text-gray-500">advance</span></span>

                    {b.status === "accepted" && !b.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400 mr-2">Rate:</span>
                        {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => handleRate(b._id, star)}
                            className="text-xl transition-transform hover:scale-125">
                            ⭐
                          </button>
                        ))}
                      </div>
                    )}

                    {b.rating && (
                      <span className="text-sm font-semibold" style={{ color: "#a78bfa" }}>
                        ⭐ Rated {b.rating}/5
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
