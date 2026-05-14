import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { useUser } from "@clerk/clerk-react";
import freelancersData from "../datas/freelancers.json";
import { CheckCircle, MapPin, Star, Zap, Shield, ChevronDown, ChevronUp } from "lucide-react";

export default function FreelancerDetails() {
  const { id } = useParams();
  const { user } = useUser();
  const [freelancer, setFreelancer] = useState(null);
  const [booking, setBooking]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [showForm, setShowForm]     = useState(false); // mobile: toggle booking panel

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        const res  = await fetch(`${BACKEND_URL}/api/freelancers/${id}`);
        const data = await res.json();
        if (data?._id) setFreelancer(data);
        else throw new Error();
      } catch {
        const found = freelancersData.find(f => f.id === id || f._id === id);
        if (found) setFreelancer(found);
        else setError("Freelancer not found");
      } finally { setLoading(false); }
    };
    fetchFreelancer();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) { setError("Please sign in to book this freelancer."); return; }
    const projectDetails = e.target.details.value.trim();
    if (!projectDetails) { setError("Please describe your project."); return; }
    try {
      const res  = await fetch(`${BACKEND_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerId: id,
          clientId: user.id,
          clientName: user.fullName,
          clientEmail: user.emailAddresses[0].emailAddress,
          projectDetails,
          advanceFee: 49,
          status: "pending",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");
      setBooking(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  const cancelBooking = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/bookings/${booking._id}/cancel`, { method: "PUT" });
      setBooking(null);
    } catch {}
  };

  /* ── loading ── */
  if (loading) return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="grid-background" /><div className="bg-bloom-top" /><div className="bg-bloom-bottom" /><div className="bg-noise" />
      <div className="page-content text-center">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading profile…</p>
      </div>
    </div>
  );

  /* ── not found ── */
  if (!freelancer) return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="grid-background" /><div className="bg-bloom-top" /><div className="bg-bloom-bottom" /><div className="bg-noise" />
      <div className="page-content text-center px-4">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-white font-bold text-xl mb-2">Freelancer Not Found</p>
        <p className="text-gray-500 text-sm">{error || "This profile doesn't exist or was removed."}</p>
      </div>
    </div>
  );

  const BookingPanel = () => (
    !booking ? (
      <div className="glass-card p-5 sm:p-7" style={{ borderColor: "rgba(124,58,237,0.25)" }}>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Book this Freelancer</h2>
        <p className="text-xs text-gray-500 mb-5">Secure booking with advance payment</p>

        {error && (
          <p className="text-red-400 text-sm mb-4 p-3 rounded-lg"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">Project Details</label>
            <textarea
              name="details"
              placeholder="Describe your project, requirements, timeline…"
              rows={4}
              className="form-input resize-none"
              onFocus={e => e.target.style.borderColor = "rgba(124,58,237,0.5)"}
              onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
            />
          </div>

          <div className="rounded-xl p-4 flex items-center justify-between"
            style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Advance Fee</p>
              <p className="text-xl font-extrabold text-white">₹49</p>
            </div>
            <Shield size={20} className="text-violet-400" />
          </div>

          <button type="submit" className="btn-primary w-full py-3 text-sm justify-center">
            Continue &amp; Pay ₹49
          </button>
        </form>

        <p className="text-xs text-gray-600 text-center mt-4">🔒 Secure payment · 100% refund if cancelled</p>
      </div>
    ) : (
      <div className="glass-card p-6 sm:p-8 text-center" style={{ borderColor: "rgba(34,197,94,0.3)" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
          style={{ background: "rgba(34,197,94,0.15)" }}>
          🎉
        </div>
        <h2 className="text-green-400 text-lg sm:text-xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-300 text-sm mb-1">You booked <strong className="text-white">{freelancer.name}</strong></p>
        <p className="text-white font-bold mb-6">Advance Paid: ₹{booking.advanceFee}</p>
        <button onClick={cancelBooking} className="btn-ghost w-full text-sm"
          style={{ color: "#f87171", borderColor: "rgba(248,113,113,0.3)" }}>
          Cancel Booking
        </button>
      </div>
    )
  );

  return (
    <div className="page-bg min-h-screen">
      <div className="grid-background" />
      <div className="bg-bloom-top" />
      <div className="bg-bloom-bottom" />
      <div className="bg-noise" />

      <div className="page-content max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ── MOBILE HEADER (visible only on small screens) ── */}
        <div className="md:hidden mb-5">
          <div className="glass-card p-5">
            {/* name + avatar row */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-extrabold shrink-0"
                style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.35),rgba(79,70,229,0.25))", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.35)" }}>
                {(freelancer.name || "?")[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-extrabold text-white truncate">{freelancer.name}</h1>
                <p className="text-xs truncate" style={{ color: "#a78bfa" }}>
                  {freelancer.category || freelancer.subcategory}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-extrabold text-white">
                  ₹{freelancer.pricing?.amount || freelancer.price}
                </p>
                <p className="text-xs text-gray-500">per project</p>
              </div>
            </div>

            {/* badges row */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(freelancer.location?.city || freelancer.city) && (
                <span className="flex items-center gap-1 text-xs text-gray-400 px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <MapPin size={11} /> {freelancer.location?.city || freelancer.city}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-yellow-400 px-2.5 py-1 rounded-full"
                style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
                <Star size={11} /> 4.8
              </span>
              <span className="flex items-center gap-1 text-xs text-green-400 px-2.5 py-1 rounded-full"
                style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
                <CheckCircle size={11} /> Verified
              </span>
              <span className="flex items-center gap-1 text-xs text-violet-400 px-2.5 py-1 rounded-full"
                style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
                <Zap size={11} /> Fast Delivery
              </span>
            </div>

            {/* Book Now toggle button */}
            {!booking && (
              <button
                onClick={() => setShowForm(f => !f)}
                className="btn-primary w-full py-2.5 text-sm justify-center"
              >
                {showForm ? <><ChevronUp size={15} /> Hide Booking Form</> : <><ChevronDown size={15} /> Book This Freelancer</>}
              </button>
            )}
          </div>

          {/* inline booking form on mobile */}
          {(showForm || booking) && (
            <div className="mt-4">
              <BookingPanel />
            </div>
          )}
        </div>

        {/* ── DESKTOP GRID ── */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">

          {/* LEFT — profile detail */}
          <div className="md:col-span-2 space-y-5 sm:space-y-6">

            {/* HEADER CARD — desktop only */}
            <div className="hidden md:block glass-card p-6 sm:p-8">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold shrink-0"
                  style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.35),rgba(79,70,229,0.25))", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.35)" }}>
                  {(freelancer.name || "?")[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{freelancer.name}</h1>
                  <p className="text-sm mb-3" style={{ color: "#a78bfa" }}>
                    {freelancer.category || freelancer.subcategory}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    {(freelancer.location?.city || freelancer.city) && (
                      <span className="flex items-center gap-1.5"><MapPin size={13} /> {freelancer.location?.city || freelancer.city}</span>
                    )}
                    <span className="flex items-center gap-1.5"><Star size={13} className="text-yellow-400" /> 4.8 Rating</span>
                    <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-green-400" /> Verified</span>
                    <span className="flex items-center gap-1.5"><Zap size={13} className="text-violet-400" /> Fast Delivery</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">
                    ₹{freelancer.pricing?.amount || freelancer.price}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {freelancer.pricing?.description || "per project"}
                  </p>
                </div>
              </div>
            </div>

            {/* ABOUT */}
            <div className="glass-card p-5 sm:p-8">
              <h2 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-4">About</h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {freelancer.bio || "This freelancer specializes in delivering high-quality work with fast turnaround and excellent communication. Perfect for both small and large projects."}
              </p>
            </div>

            {/* SKILLS */}
            {freelancer.skills?.length > 0 && (
              <div className="glass-card p-5 sm:p-8">
                <h2 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-5">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill, i) => (
                    <span key={i} className="badge-violet text-xs">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* EXPERIENCE */}
            {freelancer.experience && (
              <div className="glass-card p-5 sm:p-8">
                <h2 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-4">Experience</h2>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{freelancer.experience}</p>
              </div>
            )}

            {/* SERVICES */}
            {freelancer.services?.length > 0 && (
              <div className="glass-card p-5 sm:p-8">
                <h2 className="text-base sm:text-xl font-bold text-white mb-4 sm:mb-5">Services Offered</h2>
                <div className="space-y-3">
                  {freelancer.services.map((svc, i) => (
                    <div key={i} className="rounded-xl p-4"
                      style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)" }}>
                      <p className="text-white font-semibold text-sm mb-1">{svc.title}</p>
                      {svc.description && (
                        <p className="text-gray-400 text-xs leading-relaxed">{svc.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — booking panel (desktop only) */}
          <div className="hidden md:block">
            <div className="sticky top-24">
              <BookingPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}