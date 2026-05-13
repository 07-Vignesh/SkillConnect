import React, { useState, useEffect, useRef } from "react";

const lastUpdated = "May 11, 2026";

const sections = [
  {
    id: "introduction",
    icon: "📋",
    title: "Introduction",
    content: `Welcome to SkillConnect. We are committed to protecting your personal information and your right to privacy. This policy explains what data we collect, why we collect it, and how we handle it when you use our platform — whether you're a client hiring talent or a freelancer building your career.`,
  },
  {
    id: "information",
    icon: "🗂️",
    title: "Information We Collect",
    bullets: [
      { label: "Identity Data", detail: "Full name, username, profile photo, and government ID for verified freelancers." },
      { label: "Contact Data", detail: "Email address, phone number, and location (city/pincode)." },
      { label: "Financial Data", detail: "Payment method details, bank account info for payouts, and transaction history." },
      { label: "Usage Data", detail: "Pages visited, features used, search queries, and time spent on the platform." },
      { label: "Device Data", detail: "IP address, browser type, operating system, and device identifiers." },
    ],
  },
  {
    id: "usage",
    icon: "⚙️",
    title: "How We Use Your Data",
    bullets: [
      { label: "Matching", detail: "Power our AI engine to connect the right freelancer with the right client." },
      { label: "Payments", detail: "Process escrow payments securely and release funds to freelancers on completion." },
      { label: "Communication", detail: "Send booking confirmations, payment receipts, and service updates." },
      { label: "Safety", detail: "Detect fraud, enforce our terms, and keep the platform secure for everyone." },
      { label: "Improvement", detail: "Analyse usage patterns to improve features and fix bugs." },
    ],
  },
  {
    id: "sharing",
    icon: "🔗",
    title: "Sharing of Information",
    content: `We do not sell, trade, or rent your personal information to third parties. Data is shared only with:`,
    bullets: [
      { label: "Payment Gateways", detail: "Razorpay and Stripe process payments under their own privacy standards." },
      { label: "Cloud Providers", detail: "AWS and MongoDB Atlas host our data with enterprise-grade encryption." },
      { label: "Legal Obligations", detail: "We may disclose data when required by law or to protect legal rights." },
    ],
  },
  {
    id: "security",
    icon: "🔒",
    title: "Data Security",
    content: `We take data security seriously and implement multiple layers of protection:`,
    bullets: [
      { label: "Encryption", detail: "All data in transit is encrypted via TLS 1.3. Data at rest uses AES-256." },
      { label: "Access Control", detail: "Role-based access ensures only authorised team members can access user data." },
      { label: "Audits", detail: "We conduct regular security audits and penetration tests on our infrastructure." },
      { label: "Incident Response", detail: "We have a 24-hour breach notification protocol in place." },
    ],
  },
  {
    id: "rights",
    icon: "⚖️",
    title: "Your Rights",
    content: `You have full control over your data. At any time, you may:`,
    bullets: [
      { label: "Access", detail: "Request a full export of all personal data we hold about you." },
      { label: "Correction", detail: "Update or correct inaccurate information via your profile settings." },
      { label: "Deletion", detail: "Request permanent deletion of your account and all associated data." },
      { label: "Portability", detail: "Receive your data in a machine-readable format (JSON/CSV)." },
      { label: "Objection", detail: "Opt out of marketing communications at any time via your preferences." },
    ],
  },
  {
    id: "cookies",
    icon: "🍪",
    title: "Cookies & Tracking",
    content: `SkillConnect uses cookies and similar technologies to:`,
    bullets: [
      { label: "Session Cookies", detail: "Keep you logged in securely while you navigate the platform." },
      { label: "Analytics Cookies", detail: "Understand how users interact with our pages (via anonymised data)." },
      { label: "Preference Cookies", detail: "Remember your settings and display preferences." },
    ],
    footnote: "You can disable cookies in your browser settings, but some features may not work as expected.",
  },
  {
    id: "contact",
    icon: "✉️",
    title: "Contact Us",
    content: `If you have questions, concerns, or requests regarding this privacy policy or your data, reach out to our Privacy Officer:`,
    contact: {
      name: "Vikneshwaran",
      email: "2006vigneshvicky@gmail.com",
      location: "Karaikudi, Tamil Nadu, India",
    },
  },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Section({ s, index }) {
  const [ref, visible] = useReveal();
  const [open, setOpen] = useState(true);

  return (
    <div
      ref={ref}
      className="glass-card overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${index * 0.06}s, transform 0.55s ease ${index * 0.06}s`,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-6 sm:p-7 text-left group"
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.28)" }}>
          {s.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: "#a78bfa" }}>
            Section {index + 1}
          </p>
          <h2 className="text-white font-bold text-base sm:text-lg">{s.title}</h2>
        </div>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(124,58,237,0.25)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Body */}
      <div style={{
        maxHeight: open ? "800px" : "0",
        overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div className="px-6 sm:px-7 pb-6 sm:pb-7 space-y-4 border-t border-white/5 pt-4">
          {s.content && (
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{s.content}</p>
          )}

          {s.bullets && (
            <ul className="space-y-3">
              {s.bullets.map((b, j) => (
                <li key={j} className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#7c3aed", marginTop: "7px" }} />
                  <div>
                    <span className="text-white text-sm font-semibold">{b.label}: </span>
                    <span className="text-gray-400 text-sm">{b.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {s.footnote && (
            <p className="text-xs text-gray-500 italic border-l-2 pl-3" style={{ borderColor: "rgba(124,58,237,0.4)" }}>
              {s.footnote}
            </p>
          )}

          {s.contact && (
            <div className="rounded-xl p-4 sm:p-5 space-y-2" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <p className="text-white text-sm font-semibold">{s.contact.name} — Privacy Officer</p>
              <a href={`mailto:${s.contact.email}`} className="flex items-center gap-2 text-sm transition-colors hover:text-violet-300" style={{ color: "#a78bfa" }}>
                <span>✉</span> {s.contact.email}
              </a>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <span>📍</span> {s.contact.location}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PrivacyPolicy() {
  const tocRef = useRef(null);
  const [activeId, setActiveId] = useState("");

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    setActiveId(id);
  };

  return (
    <div className="page-bg">
      <div className="grid-background" />
      <div className="bg-bloom-top" />
      <div className="bg-bloom-bottom" />
      <div className="bg-noise" />

      {/* ══ HERO ══ */}
      <section className="page-content text-center py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />

        <div className="animate-fade-up inline-flex mb-6">
          <span className="badge-violet">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block mr-1" />
            Legal Document
          </span>
        </div>

        <h1 className="animate-fade-up-1 text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-5 tracking-tight">
          Privacy <span className="accent-text">Policy</span>
        </h1>

        <p className="animate-fade-up-2 text-gray-400 max-w-lg mx-auto text-base sm:text-lg leading-relaxed mb-8">
          At <span className="text-white font-semibold">SkillConnect</span>, your privacy isn't a checkbox — it's a commitment.
          Here's exactly how we collect, use, and protect your data.
        </p>

        {/* Meta chips */}
        <div className="animate-fade-up-3 flex flex-wrap justify-center gap-3">
          {[
            { icon: "📅", label: `Last Updated: ${lastUpdated}` },
            { icon: "📍", label: "Jurisdiction: India" },
            { icon: "🔒", label: "GDPR Aligned" },
          ].map((chip, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>
              {chip.icon} {chip.label}
            </span>
          ))}
        </div>
      </section>

      {/* ══ BODY ══ */}
      <section className="page-content px-4 sm:px-6 pb-24">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

          {/* Sticky TOC — desktop */}
          <aside className="hidden lg:block w-56 shrink-0 sticky top-24">
            <div className="glass-card p-5 space-y-1">
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#a78bfa" }}>
                Contents
              </p>
              {sections.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all"
                  style={{
                    color: activeId === s.id ? "#c4b5fd" : "#6b7280",
                    background: activeId === s.id ? "rgba(124,58,237,0.12)" : "transparent",
                  }}
                  onMouseEnter={e => { if (activeId !== s.id) e.currentTarget.style.color = "#9ca3af"; }}
                  onMouseLeave={e => { if (activeId !== s.id) e.currentTarget.style.color = "#6b7280"; }}
                >
                  <span>{s.icon}</span>
                  <span className="font-medium">{s.title}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Sections */}
          <div className="flex-1 space-y-4">
            {sections.map((s, i) => (
              <div key={s.id} id={s.id}>
                <Section s={s} index={i} />
              </div>
            ))}

            {/* Closing note */}
            <div className="glass-card p-6 sm:p-8 text-center mt-6"
              style={{ background: "rgba(124,58,237,0.06)", borderColor: "rgba(124,58,237,0.2)" }}>
              <p className="text-gray-400 text-sm leading-relaxed">
                By using SkillConnect, you agree to the terms of this Privacy Policy.
                We may update this policy from time to time — changes will always be communicated via email and a platform notice.
              </p>
              <p className="text-xs mt-3 font-medium" style={{ color: "#a78bfa" }}>
                Effective Date: January 1, 2026 · Version 2.0
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="page-content footer-gradient px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white font-bold text-base mb-0.5">SkillConnect</p>
            <p className="text-gray-500 text-xs">© 2026 SkillConnect. All rights reserved.</p>
          </div>
          <p className="text-xs" style={{ color: "#a78bfa" }}>Made with ❤️ by Vikneshwaran</p>
        </div>
      </footer>
    </div>
  );
}