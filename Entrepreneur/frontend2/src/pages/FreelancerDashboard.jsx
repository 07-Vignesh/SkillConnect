import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { CheckCircle, XCircle, TrendingUp, Star, Briefcase, User, Mail, MapPin, Tag } from "lucide-react";
import { BACKEND_URL } from "../config.js";
function FreelancerDashboard() {
  const { user } = useUser();
  const [freelancer, setFreelancer] = useState(null);
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);

  /* ── fetch freelancer: try localStorage id first, fall back to Clerk email ── */
  useEffect(() => {
    const fetchFreelancer = async () => {
      setLoading(true);
      try {
        const id    = localStorage.getItem("freelancerId");
        const token = localStorage.getItem("token");

        // Strategy 1: custom JWT login (FreelancerLogin flow)
        if (id && token) {
          const res = await fetch(`${BACKEND_URL}/api/freelancers/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setFreelancer(data);
            setLoading(false);
            return;
          }
        }

        // Strategy 2: id in localStorage but no token (ProfileSetup signup flow)
        if (id) {
          const res = await fetch(`${BACKEND_URL}/api/freelancers/${id}`);
          if (res.ok) {
            const data = await res.json();
            setFreelancer(data);
            setLoading(false);
            return;
          }
        }

        // Strategy 3: fall back to Clerk email (ProfileSetup uses Clerk user)
        const email = user?.emailAddresses?.[0]?.emailAddress;
        if (email) {
          const res = await fetch(`${BACKEND_URL}/api/freelancers/by-email/${email}`);
          if (res.ok) {
            const data = await res.json();
            // Cache the id so next load is faster
            if (data._id) localStorage.setItem("freelancerId", data._id);
            setFreelancer(data);
            setLoading(false);
            return;
          }
        }

        // No session found — show empty state
        setFreelancer(null);
      } catch {
        setFreelancer(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancer();
  }, [user]);

  /* ── fetch bookings once freelancer is loaded ── */
  useEffect(() => {
    if (!freelancer?._id) return;
    const fetchBookings = async () => {
      try {
        const res  = await fetch(`${BACKEND_URL}/api/bookings/freelancer/${freelancer._id}`);
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch {
        setBookings([]);
      }
    };
    fetchBookings();
  }, [freelancer]);

  /* ── accept / ignore booking ── */
  const handleBookingAction = async (bookingId, action) => {
    try {
      const res     = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}/${action}`, { method: "PUT" });
      const updated = await res.json();
      if (!res.ok) throw new Error();
      setBookings(prev => prev.map(b => b._id === bookingId ? updated : b));
      if (freelancer?._id) {
        const r = await fetch(`${BACKEND_URL}/api/freelancers/${freelancer._id}`);
        setFreelancer(await r.json());
      }
    } catch {}
  };

  /* ── helpers ── */
  const statusStyle = (s) => ({
    accepted: { color: "#4ade80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.25)" },
    ignored:  { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
    pending:  { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)" },
  }[s] || { color: "#9ca3af", bg: "rgba(156,163,175,0.1)", border: "rgba(156,163,175,0.2)" });

  /* ══════════════════════════════════
     LOADING
  ══════════════════════════════════ */
  if (loading) return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="grid-background" /><div className="bg-bloom-top" /><div className="bg-bloom-bottom" /><div className="bg-noise" />
      <div className="page-content text-center">
        <div className="w-12 h-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading your dashboard…</p>
      </div>
    </div>
  );

  /* ══════════════════════════════════
     EMPTY STATE — not logged in or no data yet
  ══════════════════════════════════ */
  if (!freelancer) return (
    <div className="page-bg min-h-screen">
      <div className="grid-background" /><div className="bg-bloom-top" /><div className="bg-bloom-bottom" /><div className="bg-noise" />

      <div className="page-content max-w-2xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">

        {/* Avatar placeholder */}
        <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2))", border: "1px solid rgba(124,58,237,0.4)" }}>
          👋
        </div>

        <span className="badge-violet mb-5 inline-flex">Freelancer Dashboard</span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Welcome to Your <span className="accent-text">Dashboard</span>
        </h1>

        <p className="text-gray-400 text-base sm:text-lg mb-10 leading-relaxed max-w-md mx-auto">
          Your profile data will appear here once you're fully set up.
          Log in with your freelancer account to see your bookings, earnings, and more.
        </p>

        {/* What you'll see here cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
          {[
            { icon: <TrendingUp size={18} />, title: "Earnings",  desc: "Track your total income from every completed project." },
            { icon: <Briefcase size={18} />,  title: "Bookings",  desc: "Accept or decline incoming client requests in real time." },
            { icon: <Star size={18} />,        title: "Ratings",   desc: "See your average rating and client reviews at a glance." },
          ].map((card, i) => (
            <div key={i} className="glass-card p-5 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.28)", color: "#a78bfa" }}>
                {card.icon}
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">{card.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/freelancer-login">
            <button className="btn-primary px-7 py-3">Log In as Freelancer</button>
          </Link>
          <Link to="/freelancer-signup">
            <button className="btn-ghost px-7 py-3">Create Account</button>
          </Link>
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════
     FULL DASHBOARD
  ══════════════════════════════════ */
  const projects = freelancer.projects || [];
  const earnings = projects.reduce((a, c) => a + (c.amount || 0), 0);
  const rating   = projects.length > 0
    ? (projects.reduce((a, c) => a + (c.rating || 0), 0) / projects.length).toFixed(1)
    : "—";

  const dashStats = [
    { icon: <TrendingUp size={18} />, label: "Total Earnings",  value: `₹${earnings}`,                              sub: `${projects.length} project${projects.length !== 1 ? "s" : ""}` },
    { icon: <Star size={18} />,       label: "Average Rating",  value: rating === "—" ? "—" : `⭐ ${rating}`,       sub: "Based on reviews" },
    { icon: <Briefcase size={18} />,  label: "Pending Requests",value: bookings.filter(b => b.status === "pending").length, sub: "Awaiting response" },
    { icon: <CheckCircle size={18} />,label: "Completed",       value: projects.length,                              sub: "Total projects" },
  ];

  return (
    <div className="page-bg min-h-screen">
      <div className="grid-background" /><div className="bg-bloom-top" /><div className="bg-bloom-bottom" /><div className="bg-noise" />

      <div className="page-content max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-extrabold shrink-0"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(79,70,229,0.25))", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.35)" }}>
            {(freelancer.name || "?")[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {freelancer.name} 👋
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              {freelancer.email && (
                <span className="flex items-center gap-1 text-xs text-gray-500"><Mail size={11} />{freelancer.email}</span>
              )}
              {(freelancer.city || freelancer.location?.city) && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={11} />{freelancer.city || freelancer.location?.city}
                </span>
              )}
              {(freelancer.subcategory || freelancer.category) && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Tag size={11} />{freelancer.subcategory || freelancer.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dashStats.map((s, i) => (
            <div key={i} className="glass-card p-5 sm:p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2" style={{ color: "#a78bfa" }}>
                {s.icon}
                <span className="text-xs text-gray-400">{s.label}</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white">{s.value}</div>
              <div className="text-xs text-gray-500">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── SKILLS ── */}
        {freelancer.skills?.length > 0 && (
          <div className="glass-card p-5 sm:p-6">
            <h2 className="text-base font-bold text-white mb-4">Your Skills</h2>
            <div className="flex flex-wrap gap-2">
              {freelancer.skills.map((sk, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.28)", color: "#c4b5fd" }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── COMPLETED PROJECTS ── */}
        {projects.length > 0 ? (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Completed Projects</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {projects.map((p, i) => (
                <div key={p._id || i} className="glass-card p-5 sm:p-6 flex flex-col gap-3">
                  <h3 className="font-bold text-white text-sm sm:text-base">{p.projectTitle}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Client: {p.clientName}</p>
                  <div className="flex items-center justify-between pt-3 mt-auto"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="text-lg sm:text-xl font-extrabold text-white">₹{p.amount}</span>
                    {p.rating && <span className="text-yellow-400 text-sm">⭐ {p.rating}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card p-8 sm:p-10 text-center">
            <div className="text-3xl mb-3">🚀</div>
            <p className="text-white font-semibold mb-1">No projects yet</p>
            <p className="text-gray-500 text-sm">Completed projects will show up here after clients mark them done.</p>
          </div>
        )}

        {/* ── BOOKINGS ── */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Incoming Bookings</h2>
          {bookings.length === 0 ? (
            <div className="glass-card p-8 sm:p-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-white font-semibold mb-1">No bookings yet</p>
              <p className="text-gray-500 text-sm">When clients book you, their requests will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(b => {
                const st = statusStyle(b.status);
                return (
                  <div key={b._id} className="glass-card p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm sm:text-base mb-1">{b.projectDetails}</p>
                        <p className="text-xs sm:text-sm text-gray-400">{b.clientName} · {b.clientEmail}</p>
                        <p className="text-xs sm:text-sm text-gray-300 mt-1">
                          Advance: <span className="font-bold text-white">₹{b.advanceFee}</span>
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold self-start shrink-0"
                        style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                        {b.status}
                      </span>
                    </div>

                    {b.status === "pending" && (
                      <div className="flex gap-3 mt-4 pt-4"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                        <button onClick={() => handleBookingAction(b._id, "accept")}
                          className="btn-primary text-xs px-5 py-2 flex items-center gap-1.5">
                          <CheckCircle size={13} /> Accept
                        </button>
                        <button onClick={() => handleBookingAction(b._id, "ignore")}
                          className="text-xs px-5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5"
                          style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" }}>
                          <XCircle size={13} /> Ignore
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default FreelancerDashboard;