import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { BACKEND_URL } from "../config";
import { CheckCircle, Clock, Star, Briefcase, AlertCircle, X } from "lucide-react";

/* ── Toast component ── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = {
    success: { bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.35)",  color: "#4ade80",  icon: <CheckCircle size={16} /> },
    error:   { bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.35)", color: "#f87171",  icon: <AlertCircle size={16} /> },
    info:    { bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.35)", color: "#a78bfa",  icon: <Star size={16} /> },
  }[type] || {};

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl animate-fade-up"
      style={{ background: styles.bg, border: `1px solid ${styles.border}`, backdropFilter: "blur(20px)", minWidth: "260px", maxWidth: "360px" }}>
      <span style={{ color: styles.color }}>{styles.icon}</span>
      <p className="text-sm text-white flex-1">{message}</p>
      <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors ml-1">
        <X size={14} />
      </button>
    </div>
  );
}

/* ── Star rating UI ── */
function StarRating({ bookingId, onRate, disabled }) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async (star) => {
    if (submitting || disabled) return;
    setSelected(star);
    setSubmitting(true);
    await onRate(bookingId, star);
    setSubmitting(false);
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-400 mr-1">Rate work:</span>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          disabled={submitting || disabled}
          onClick={() => handleClick(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-all duration-150 disabled:opacity-50"
          style={{
            fontSize: "1.25rem",
            transform: (hovered >= star || selected >= star) ? "scale(1.25)" : "scale(1)",
            filter: (hovered >= star || selected >= star)
              ? "drop-shadow(0 0 6px rgba(251,191,36,0.7))"
              : "grayscale(0.5) brightness(0.7)",
          }}
        >
          ⭐
        </button>
      ))}
      {submitting && (
        <span className="ml-2 text-xs text-gray-400 animate-pulse">Saving…</span>
      )}
    </div>
  );
}

const statusConfig = (s) => ({
  accepted:  { color: "#4ade80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.25)",  label: "Accepted",  icon: <CheckCircle size={12} /> },
  pending:   { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)",  label: "Pending",   icon: <Clock size={12} /> },
  completed: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)", label: "Completed", icon: <CheckCircle size={12} /> },
  ignored:   { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)", label: "Declined",  icon: <AlertCircle size={12} /> },
}[s] || { color: "#9ca3af", bg: "rgba(156,163,175,0.1)", border: "rgba(156,163,175,0.2)", label: s, icon: null });

export default function UserBookings() {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState(null);

  const showToast = (message, type = "info") => setToast({ message, type });
  const hideToast = () => setToast(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const email = user.emailAddresses[0].emailAddress;
        const res   = await fetch(`${BACKEND_URL}/api/bookings/client/${email}`);
        if (!res.ok) throw new Error();
        const data  = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch {
        showToast("Couldn't load your bookings. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleRate = async (bookingId, ratingValue) => {
    try {
      const res  = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}/rate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: ratingValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Rating failed");

      setBookings(prev =>
        prev.map(b =>
          b._id === bookingId ? { ...b, rating: ratingValue, status: "completed" } : b
        )
      );
      showToast(`Thanks for rating! You gave ${ratingValue} out of 5 stars. ⭐`, "success");
    } catch (e) {
      showToast(e.message === "Rating failed" ? "Couldn't save your rating. Please try again." : e.message, "error");
    }
  };

  /* ── summary counts ── */
  const counts = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === "pending").length,
    accepted:  bookings.filter(b => b.status === "accepted").length,
    completed: bookings.filter(b => b.status === "completed").length,
  };

  return (
    <div className="page-bg min-h-screen">
      <div className="grid-background" />
      <div className="bg-bloom-top" />
      <div className="bg-bloom-bottom" />
      <div className="bg-noise" />

      <div className="page-content max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">

        {/* ── HEADER ── */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="badge-violet mb-5 inline-flex">My Activity</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">My Bookings</h1>
          <p className="text-gray-400 text-sm sm:text-base">Track and manage all your hired freelancers</p>
        </div>

        {/* ── SUMMARY CHIPS ── */}
        {!loading && bookings.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { label: "Total",     value: counts.total,     icon: <Briefcase size={13} />,   color: "#9ca3af" },
              { label: "Pending",   value: counts.pending,   icon: <Clock size={13} />,        color: "#fbbf24" },
              { label: "Accepted",  value: counts.accepted,  icon: <CheckCircle size={13} />,  color: "#4ade80" },
              { label: "Completed", value: counts.completed, icon: <Star size={13} />,          color: "#a78bfa" },
            ].map((chip, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: chip.color }}>
                {chip.icon}
                <span className="text-white">{chip.value}</span>
                <span className="text-gray-500">{chip.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── LOADING ── */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Fetching your bookings…</p>
          </div>

        /* ── NOT SIGNED IN ── */
        ) : !user ? (
          <div className="glass-card p-10 sm:p-14 text-center">
            <div className="text-5xl mb-4">🔐</div>
            <p className="text-white font-semibold text-lg mb-2">Sign in to see your bookings</p>
            <p className="text-gray-500 text-sm">Your booking history will appear here once you're logged in.</p>
          </div>

        /* ── EMPTY ── */
        ) : bookings.length === 0 ? (
          <div className="glass-card p-10 sm:p-14 text-center">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-white font-semibold text-lg mb-2">No bookings yet</p>
            <p className="text-gray-500 text-sm">When you hire a freelancer, your bookings will show up here.</p>
          </div>

        /* ── BOOKING CARDS ── */
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {bookings.map(b => {
              const st = statusConfig(b.status);
              return (
                <div key={b._id} className="glass-card p-5 sm:p-7">

                  {/* top row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.28)" }}>
                        <Briefcase size={16} style={{ color: "#a78bfa" }} />
                      </div>
                      <h2 className="font-bold text-white text-sm sm:text-base">Project Booking</h2>
                    </div>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0"
                      style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                      {st.icon} {st.label}
                    </span>
                  </div>

                  {/* project details */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{b.projectDetails}</p>

                  {/* freelancer name if available */}
                  {(b.freelancerName || b.freelancerId) && (
                    <p className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
                      Freelancer: <span className="text-gray-400 font-medium">{b.freelancerName || b.freelancerId}</span>
                    </p>
                  )}

                  {/* bottom row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>

                    <span className="text-xl font-extrabold text-white">
                      ₹{b.advanceFee}
                      <span className="text-xs font-normal text-gray-500 ml-1">advance</span>
                    </span>

                    {/* rating input — show for accepted bookings not yet rated */}
                    {b.status === "accepted" && !b.rating && (
                      <StarRating bookingId={b._id} onRate={handleRate} />
                    )}

                    {/* already rated */}
                    {b.rating && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                        style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)" }}>
                        <span className="text-sm">⭐</span>
                        <span className="text-sm font-semibold" style={{ color: "#a78bfa" }}>
                          You rated {b.rating}/5
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── TOAST ── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}