import React, { useEffect, useRef, useState } from "react";

const team = [
  {
    name: "Vikneshwaran",
    role: "Founder & CEO",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    desc: "Visionary behind SkillConnect. Passionate about building fair, AI-powered platforms that empower every worker.",
    social: { linkedin: "#", github: "#" },
  },
  {
    name: "Iklash",
    role: "Head of Operations",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brian",
    emoji: "⚙️",
    desc: "Keeps the engine running smoothly — from onboarding to payments, ops is his domain.",
    social: { linkedin: "#", github: "#" },
  },
  {
    name: "Sabana",
    role: "Tech Lead",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit",
    emoji: "🛠️",
    desc: "Architect of the SkillConnect stack. Loves clean code, fast systems, and solving hard engineering problems.",
    social: { linkedin: "#", github: "#" },
  },
];

const values = [
  {
    icon: "⚡",
    title: "Speed First",
    desc: "Freelancers get paid instantly. Clients get matched in seconds. Every decision we make optimises for speed.",
  },
  {
    icon: "🔒",
    title: "Trust by Design",
    desc: "Escrow payments, verified profiles, and transparent reviews — trust isn't an add-on, it's the foundation.",
  },
  {
    icon: "⚖️",
    title: "Zero Exploitation",
    desc: "The lowest fees in the market. No hidden charges. Every rupee a freelancer earns, they keep.",
  },
  {
    icon: "🌍",
    title: "Local Roots",
    desc: "Built for India. We understand the blue-collar worker, the student freelancer, and the local entrepreneur.",
  },
];

const milestones = [
  { year: "2024", event: "SkillConnect founded in Karaikudi, Tamil Nadu" },
  { year: "Q1 2025", event: "First 500 freelancers onboarded" },
  { year: "Q3 2025", event: "AI-matching engine launched" },
  { year: "2026", event: "12,000+ active freelancers across India" },
];

const clients = [
  { name: "Hareesh",  seed: "Sarah", role: "Client" },
  { name: "Karthick", seed: "Alex",  role: "Client" },
  { name: "Arun",     seed: "Emma",  role: "Freelancer" },
];

/* ── Intersection-aware reveal hook ── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealDiv({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function AboutUs() {
  return (
    <div className="page-bg">
      <div className="grid-background" />
      <div className="bg-bloom-top" />
      <div className="bg-bloom-bottom" />
      <div className="bg-noise" />

      {/* ══ HERO ══ */}
      <section className="page-content relative text-center py-28 sm:py-36 px-4 sm:px-6 overflow-hidden">
        {/* floating orbs */}
        <div className="pointer-events-none absolute top-8 left-1/3 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-60 h-60 rounded-full opacity-8 blur-3xl"
          style={{ background: "radial-gradient(circle, #0891b2, transparent)" }} />

        <div className="animate-fade-up inline-flex mb-6">
          <span className="badge-violet">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block mr-1" />
            Est. 2024 · Karaikudi, India
          </span>
        </div>

        <h1 className="animate-fade-up-1 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.06] mb-6 max-w-3xl mx-auto">
          <span className="text-white">Built with</span>{" "}
          <span className="accent-text">Purpose.</span><br />
          <span className="text-white">Driven by</span>{" "}
          <span className="accent-text">People.</span>
        </h1>

        <p className="animate-fade-up-2 text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          SkillConnect was born from a simple belief — every skilled person deserves a fair platform
          to earn, grow, and thrive. No exploitation. No middlemen. Just work.
        </p>

        {/* decorative line */}
        <div className="animate-fade-up-3 flex items-center justify-center gap-4 mt-10">
          <div className="h-px w-16 sm:w-24" style={{ background: "linear-gradient(to right, transparent, rgba(124,58,237,0.5))" }} />
          <span className="text-violet-400 text-lg">✦</span>
          <div className="h-px w-16 sm:w-24" style={{ background: "linear-gradient(to left, transparent, rgba(124,58,237,0.5))" }} />
        </div>
      </section>

      {/* ══ STORY SPLIT ══ */}
      <section className="page-content py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <RevealDiv delay={0}>
            <p className="section-label mb-3">The Origin</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
              Why We Built<br />SkillConnect
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4 text-sm sm:text-base">
              We saw students and part-time workers getting squeezed by platforms that took up to 20% of
              every payment. We watched talented people quit freelancing because payments took weeks.
            </p>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              SkillConnect was our answer — a platform with near-zero fees, instant payouts, and AI-driven
              matching that actually works for workers, not against them.
            </p>
          </RevealDiv>

          {/* Timeline */}
          <RevealDiv delay={0.15}>
            <div className="glass-card p-6 sm:p-8 space-y-0">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-4 relative">
                  {/* vertical connector */}
                  {i < milestones.length - 1 && (
                    <div className="absolute left-[17px] top-8 bottom-0 w-px"
                      style={{ background: "linear-gradient(to bottom, rgba(124,58,237,0.4), transparent)" }} />
                  )}
                  {/* dot */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 mt-1"
                    style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.45)" }}>
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-400 block" />
                  </div>
                  <div className="pb-7">
                    <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#a78bfa" }}>{m.year}</p>
                    <p className="text-white text-sm sm:text-base font-medium">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* ══ MISSION ══ */}
      <section className="page-content py-16 sm:py-20 px-4 sm:px-6">
        <RevealDiv className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-10 sm:p-14 relative overflow-hidden"
            style={{ background: "rgba(124,58,237,0.07)", borderColor: "rgba(124,58,237,0.25)" }}>
            {/* bg accent */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18), transparent)", filter: "blur(28px)" }} />
            <p className="section-label mb-4">Our Mission</p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug relative">
              "Connect talent with opportunity at the{" "}
              <span className="accent-text">lowest fees</span>, with{" "}
              <span className="accent-text">instant pay</span> — because fair work deserves fair pay."
            </p>
          </div>
        </RevealDiv>
      </section>

      {/* ══ VALUES ══ */}
      <section className="page-content py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <RevealDiv className="text-center mb-12 sm:mb-16">
            <p className="section-label mb-3">What We Stand For</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base">
              These aren't posters on a wall — they're the rules we code by.
            </p>
          </RevealDiv>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {values.map((v, i) => (
              <RevealDiv key={i} delay={i * 0.08}>
                <div className="glass-card p-6 sm:p-7 h-full flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.28)" }}>
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base sm:text-lg mb-2">{v.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TEAM ══ */}
      <section className="page-content py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <RevealDiv className="text-center mb-12 sm:mb-16">
            <p className="section-label mb-3">The People</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Meet the Team</h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base">
              Small team, big vision. We're builders first — everything else comes second.
            </p>
          </RevealDiv>

          <div className="grid gap-5 sm:gap-6 sm:grid-cols-3">
            {team.map((member, i) => (
              <RevealDiv key={i} delay={i * 0.1}>
                <div className="glass-card p-7 sm:p-8 text-center group flex flex-col items-center h-full">
                  {/* Avatar */}
                  <div className="relative mb-5">
                    <div className="w-20 h-20 rounded-full p-0.5 mx-auto"
                      style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(79,70,229,0.3))" }}>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                        style={{ background: "rgba(20,20,40,1)" }}
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 text-xl">{member.emoji}</span>
                  </div>

                  {/* Info */}
                  <h3 className="font-bold text-base sm:text-lg text-white mb-1">{member.name}</h3>
                  <p className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "#a78bfa" }}>
                    {member.role}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed flex-1">{member.desc}</p>

                  {/* Social links */}
                  <div className="flex gap-3 mt-5">
                    <a href={member.social.linkedin}
                      className="text-xs px-3 py-1.5 rounded-full transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)"; e.currentTarget.style.color = "#c4b5fd"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#9ca3af"; }}>
                      LinkedIn
                    </a>
                    <a href={member.social.github}
                      className="text-xs px-3 py-1.5 rounded-full transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)"; e.currentTarget.style.color = "#c4b5fd"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#9ca3af"; }}>
                      GitHub
                    </a>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TRUSTED BY ══ */}
      <section className="page-content py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <RevealDiv>
            <p className="section-label mb-3">Community</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10">Trusted By Real People</h2>
            <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
              {clients.map((c, i) => (
                <div key={i} className="glass-card flex flex-col items-center p-5 sm:p-6 w-32 sm:w-36 hover:-translate-y-1.5 transition-transform duration-300 cursor-default">
                  <div className="w-14 h-14 rounded-full p-0.5 mb-3"
                    style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(79,70,229,0.25))" }}>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.seed}`}
                      alt={c.name}
                      className="w-full h-full rounded-full"
                      style={{ background: "rgba(20,20,40,1)" }}
                    />
                  </div>
                  <span className="text-sm text-white font-semibold">{c.name}</span>
                  <span className="text-xs mt-0.5" style={{ color: "#a78bfa" }}>{c.role}</span>
                </div>
              ))}
            </div>
          </RevealDiv>
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