import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { useUser } from "@clerk/clerk-react";
import freelancersData from "../datas/freelancers.json";
import { CheckCircle, MapPin, Star, Zap, Shield } from "lucide-react";

export default function FreelancerDetails() {
  const { id } = useParams();
  const { user } = useUser();
  const [freelancer, setFreelancer] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/freelancers/${id}`);
        const data = await res.json();
        if (data && data._id) { setFreelancer(data); }
        else throw new Error("Not in DB");
      } catch {
        const found = freelancersData.find(f => f.id === id || f._id === id);
        if (found) { setFreelancer(found); setError(""); }
        else setError("Freelancer not found");
      } finally { setLoading(false); }
    };
    fetchFreelancer();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) { setError("Please login first"); return; }
    const projectDetails = e.target.details.value;
    if (!projectDetails) { setError("Project details required"); return; }
    const res = await fetch(`${BACKEND_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ freelancerId: id, clientId: user.id, clientName: user.fullName, clientEmail: user.emailAddresses[0].emailAddress, projectDetails, advanceFee: 49, status: "pending" }),
    });
    const data = await res.json();
    setBooking(data);
  };

  const cancelBooking = async () => {
    await fetch(`${BACKEND_URL}/api/bookings/${booking._id}/cancel`, { method: "PUT" });
    setBooking(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#080810" }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading profile...</p>
      </div>
    </div>
  );

  if (!freelancer) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#080810" }}>
      <p className="text-red-400">Freelancer not found</p>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden px-6 py-12" style={{ backgroundColor: "#080810" }}>
      <div className="grid-background" />
      <div className="bg-bloom-top" />
      <div className="bg-bloom-bottom" />
      <div className="bg-noise" />

      <div className="page-content max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {/* LEFT — PROFILE */}
        <div className="md:col-span-2 space-y-6">

          {/* HEADER CARD */}
          <div className="glass-card p-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(79,70,229,0.25))", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.35)" }}>
                {(freelancer.name || "?")[0]}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-extrabold text-white mb-1">{freelancer.name}</h1>
                <p className="text-sm mb-3" style={{ color: "#a78bfa" }}>{freelancer.category || freelancer.subcategory}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5"><MapPin size={13} /> {freelancer.location?.city || freelancer.city}</span>
                  <span className="flex items-center gap-1.5"><Star size={13} className="text-yellow-400" /> 4.8 Rating</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-green-400" /> Verified</span>
                  <span className="flex items-center gap-1.5"><Zap size={13} className="text-violet-400" /> Fast Delivery</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-white">₹{freelancer.pricing?.amount || freelancer.price}</p>
                <p className="text-xs text-gray-500 mt-1">{freelancer.pricing?.description || "per project"}</p>
              </div>
            </div>
          </div>

          {/* ABOUT */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-4">About</h2>
            <p className="text-gray-400 leading-relaxed">
              {freelancer.bio || "This freelancer specializes in delivering high-quality work with fast turnaround and excellent communication. Perfect for both small and large projects."}
            </p>
          </div>

          {/* SKILLS */}
          {freelancer.skills && freelancer.skills.length > 0 && (
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-5">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((skill, i) => (
                  <span key={i} className="badge-violet">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {freelancer.experience && (
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-4">Experience</h2>
              <p className="text-gray-400">{freelancer.experience}</p>
            </div>
          )}
        </div>

        {/* RIGHT — BOOKING */}
        <div>
          {!booking ? (
            <div className="sticky top-24 glass-card p-7" style={{ borderColor: "rgba(124,58,237,0.25)" }}>
              <h2 className="text-xl font-bold text-white mb-2">Book this Freelancer</h2>
              <p className="text-xs text-gray-500 mb-6">Secure booking with advance payment</p>

              {error && <p className="text-red-400 text-sm mb-4 p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</p>}

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">Project Details</label>
                  <textarea
                    name="details"
                    placeholder="Describe your project, requirements, timeline..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-gray-500 outline-none resize-none transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => { e.target.style.borderColor = "rgba(124,58,237,0.5)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                </div>

                <div className="rounded-lg p-4 flex items-center justify-between" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <div>
                    <p className="text-xs text-gray-400">Advance Fee</p>
                    <p className="text-lg font-extrabold text-white">₹49</p>
                  </div>
                  <Shield size={20} className="text-violet-400" />
                </div>

                <button type="submit" className="btn-primary w-full py-3 text-sm">Continue & Pay ₹49</button>
              </form>

              <p className="text-xs text-gray-600 text-center mt-4">🔒 Secure payment · 100% refund if cancelled</p>
            </div>
          ) : (
            <div className="glass-card p-8 text-center" style={{ borderColor: "rgba(34,197,94,0.3)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl" style={{ background: "rgba(34,197,94,0.15)" }}>
                🎉
              </div>
              <h2 className="text-green-400 text-xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-gray-300 mb-1">You booked <strong>{freelancer.name}</strong></p>
              <p className="text-white font-bold mb-6">Advance Paid: ₹{booking.advanceFee}</p>
              <button onClick={cancelBooking} className="btn-ghost w-full text-red-400 border-red-500/30 hover:bg-red-500/10">
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
