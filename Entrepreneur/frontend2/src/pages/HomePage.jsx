import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import ChatBot from "./ChatBot";
import banner4 from "../assets/banner5.png";
import blueCollar from "../assets/bluecollar.png";
import whiteCollar from "../assets/whitecollar.png";

const stats = [
  { value: "12K+", label: "Active Freelancers",  icon: "👥" },
  { value: "98%",  label: "Client Satisfaction", icon: "⭐" },
  { value: "50+",  label: "Service Categories",  icon: "📂" },
  { value: "4.9",  label: "Average Rating",      icon: "🏆" },
];

const features = [
  { icon: "⚡", title: "Instant Matching",        tag: "AI-Powered",      desc: "Our AI engine scans thousands of freelancer profiles and finds the perfect match for your project in seconds — not days." },
  { icon: "🔒", title: "Secure Payments",         tag: "Escrow Protected", desc: "Every payment is held in escrow and only released when you approve the work. Your money is always protected." },
  { icon: "🤖", title: "Smart Recommendations",   tag: "Personalized",    desc: "Get personalized freelancer suggestions based on your project scope, budget, timeline, and past hiring history." },
  { icon: "📍", title: "Location-Based Hiring",   tag: "Local & Remote",  desc: "Find skilled workers near you for on-site jobs, or hire globally for remote work. Your choice, your terms." },
  { icon: "💬", title: "Built-in Chat & AI Bot",  tag: "24/7 Support",    desc: "Communicate directly with freelancers via our built-in chat. Our AI assistant is available 24/7 to help you." },
  { icon: "📊", title: "Real-Time Dashboard",     tag: "Full Visibility", desc: "Track all your bookings, payments, and project progress from a single clean dashboard — for clients and freelancers alike." },
];

const steps = [
  { n: "01", icon: "🔍", title: "Post or Browse",   desc: "Search by skill, category, or location. Find exactly who you need from our pool of verified professionals." },
  { n: "02", icon: "🤝", title: "Connect & Agree",  desc: "Chat with freelancers, review portfolios, compare rates, and agree on terms before any payment is made." },
  { n: "03", icon: "✅", title: "Work Gets Done",   desc: "Payment is released only after you confirm the work is complete. Smooth, safe, and simple every time." },
];

const testimonials = [
  { name: "Karthick R.", role: "Startup Founder",   avatar: "K", color: "#7c3aed", rating: 5, text: "Hired a full-stack developer within 2 hours. The AI matching is genuinely impressive — it understood exactly what I needed." },
  { name: "Priya M.",    role: "Marketing Manager", avatar: "P", color: "#0891b2", rating: 5, text: "Found a local graphic designer who delivered in 24 hours. The escrow payment gave me complete confidence." },
  { name: "Arun S.",     role: "Home Owner",        avatar: "A", color: "#059669", rating: 5, text: "Booked a plumber the same day through SkillConnect. No middlemen, no extra fees. Exactly what I was looking for." },
];

function Counter({ value }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const observed = useRef(false);
  useEffect(() => {
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix  = value.replace(/[0-9.]/g, "");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !observed.current) {
        observed.current = true;
        let start = 0;
        const steps = 40;
        const inc = numeric / steps;
        const timer = setInterval(() => {
          start += inc;
          if (start >= numeric) { clearInterval(timer); setDisplay(value); }
          else setDisplay(Number.isInteger(numeric) ? Math.floor(start) + suffix : start.toFixed(1) + suffix);
        }, 35);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
  return <span ref={ref}>{display}</span>;
}

export default function HomePage() {
  const { isSignedIn } = useUser();
  const [role, setRole] = useState("");

  // Clear role on sign-out
  useEffect(() => {
    if (isSignedIn === false) {
      setRole("");
      localStorage.removeItem("role");
    }
  }, [isSignedIn]);

  // Read role on mount and whenever FreelancerLogin/Signup fires roleChanged.
  // Empty dep array is intentional — this must never re-run and race with Clerk.
  useEffect(() => {
    const onRoleChanged = () => setRole(localStorage.getItem("role") || "");
    onRoleChanged();
    window.addEventListener("roleChanged", onRoleChanged);
    return () => window.removeEventListener("roleChanged", onRoleChanged);
  }, []);

  const [chatSessionId] = useState(() => {
    const key = "skillconnect_chat_session_id";
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const nextId = `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, nextId);
    return nextId;
  });

  const sendMessage = async (message) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
      const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

      if (!apiKey) {
        return { general_answer: "Gemini API key is missing. Add VITE_GEMINI_API_KEY to the frontend .env file." };
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text:
                    "You are the SkillConnect AI assistant for the freelancer marketplace app built by Vikneshwaran. Developer/owner: Vikneshwaran. Portfolio: vikneshwaran.dev. This app is a platform for hiring freelancers and connecting clients with technical and non-technical service providers in India. Help users with hiring, freelancer discovery, categories, pricing, bookings, support, login, signup, and profile tasks. Keep answers concise, helpful, and professional. When asked about the app creator or developer, mention that this app was developed by Vikneshwaran and the portfolio is vikneshwaran.dev."
                }
              ]
            },
            contents: [
              {
                role: "user",
                parts: [{ text: message }],
              }
            ]
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Gemini API error (${res.status})`);
      }

      const data = await res.json();
      const answer =
        data?.candidates?.[0]?.content?.parts
          ?.map((part) => part.text)
          .join("")
          .trim() || "No response received";

      return { general_answer: answer };
    } catch (error) {
      console.error("Gemini chat request error:", error);
      return { general_answer: "Sorry, the AI service is currently unavailable. Please try again." };
    }
  };

  return (
    <div className="page-bg">
      <div className="grid-background" />
      <div className="bg-bloom-top" />
      <div className="bg-bloom-bottom" />
      <div className="bg-noise" />

      {/* ══ HERO ══ */}
      <section className="page-content relative flex flex-col items-center text-center pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="pointer-events-none absolute top-10 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #0891b2, transparent)" }} />

        <div className="animate-fade-up mb-6">
          <span className="badge-violet">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block mr-1" />
            Trusted by 12,000+ freelancers across India
          </span>
        </div>

        <h1 className="animate-fade-up-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-5 max-w-4xl mx-auto">
          <span className="text-white">The Smarter Way to</span><br />
          <span className="accent-text">Hire &amp; Get Hired</span>
        </h1>

        <p className="animate-fade-up-2 text-gray-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-10">
          SkillConnect connects clients with top-tier freelancers for technical and hands-on work.
          AI-powered matching. Secure payments. Zero hassle.
        </p>

        <div className="animate-fade-up-3 flex flex-wrap justify-center gap-3 mb-16">
          {role === "freelancer" ? (
            // Signed in as freelancer → show dashboard + browse
            <>
              <Link to="/freelancer-dashboard"><button className="btn-primary px-7 py-3 text-sm sm:text-base">📊 My Dashboard</button></Link>
              <Link to="/categories"><button className="btn-ghost px-7 py-3 text-sm sm:text-base">🗂 Browse Categories</button></Link>
            </>
          ) : (
            // Not signed in OR signed in as client → always show Hire + Become a Freelancer
            <>
              <Link to="/services"><button className="btn-primary px-7 py-3 text-sm sm:text-base">🚀 Find a Freelancer</button></Link>
              <Link to="/freelancer-signup"><button className="btn-ghost px-7 py-3 text-sm sm:text-base">💼 Become a Freelancer</button></Link>
              {isSignedIn && (
                <Link to="/UserBooking"><button className="btn-ghost px-7 py-3 text-sm sm:text-base">📋 My Bookings</button></Link>
                
              )}
              {isSignedIn && (
                <Link to="/freelancer-dashboard"><button className="btn-ghost px-7 py-3 text-sm sm:text-base"> 👤 My Dashboard</button></Link>
                
              )}
            </>
          )}
        </div>

        <div className="animate-fade-up-4 animate-float w-full max-w-5xl mx-auto">
          <div className="hero-image-wrapper" style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.25)" }}>
            <img src={banner4} alt="SkillConnect Platform" className="rounded-[17px] w-full" />
            <div className="absolute bottom-0 inset-x-0 h-16 rounded-b-[17px]" style={{ background: "linear-gradient(to top, #080810, transparent)" }} />
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="page-content py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="section-divider mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {stats.map((s, i) => (
              <div key={i} className="glass-card p-5 sm:p-6 flex flex-col items-center text-center gap-2">
                <span className="text-2xl">{s.icon}</span>
                <div className="font-extrabold text-2xl sm:text-3xl md:text-4xl" style={{ fontFamily: "'Syne', sans-serif", background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.72))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  <Counter value={s.value} />
                </div>
                <p className="text-gray-400 text-xs sm:text-sm font-medium leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ JOB TYPES ══ */}
      <section className="page-content py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="section-label mb-3">Who We Serve</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Opportunities for Everyone</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
              Whether you wear a suit or carry a toolkit — SkillConnect has the right work for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 sm:gap-7">
            {/* White Collar */}
            <div className="glass-card overflow-hidden group flex flex-col">
              <div className="relative h-52 sm:h-60 overflow-hidden shrink-0">
                <img src={whiteCollar} alt="Professional Services" className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,8,16,0.92) 0%, rgba(8,8,16,0.3) 55%, transparent 100%)" }} />
<span className="absolute top-4 left-4 bg-violet-600 text-white px-2 py-1 rounded-full font-semibold shadow-lg">
  White Collar
</span>              </div>
              <div className="p-6 sm:p-7 flex flex-col gap-3 flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Professional Services</h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed flex-1">
                  Connect with skilled developers, designers, marketers, writers, and analysts.
                  Work on your schedule — remotely or on-site with top clients.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Development", "Design", "Marketing", "Data"].map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.28)", color: "#c4b5fd" }}>{tag}</span>
                  ))}
                </div>
                <Link to="/services" className="mt-2">
                  <button className="btn-primary w-full py-2.5 text-sm justify-center">Browse Professionals →</button>
                </Link>
              </div>
            </div>

            {/* Blue Collar */}
            <div className="glass-card overflow-hidden group flex flex-col">
              <div className="relative h-52 sm:h-60 overflow-hidden shrink-0">
                <img src={blueCollar} alt="Skilled Trades" className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,8,16,0.92) 0%, rgba(8,8,16,0.3) 55%, transparent 100%)" }} />
                <span className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded-full font-semibold shadow-lg">Blue Collar</span>
              </div>
              <div className="p-6 sm:p-7 flex flex-col gap-3 flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Skilled Trades</h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed flex-1">
                  Find electricians, plumbers, drivers, carpenters, and more in your area.
                  Get hands-on jobs done quickly with trusted local workers.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Electrician", "Plumber", "Driver", "Carpenter"].map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(8,145,178,0.15)", border: "1px solid rgba(8,145,178,0.3)", color: "#67e8f9" }}>{tag}</span>
                  ))}
                </div>
                <Link to="/non-technical" className="mt-2">
                  <button className="btn-ghost w-full py-2.5 text-sm justify-center">Browse Tradespeople →</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="page-content py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="section-label mb-3">Platform Advantages</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Why Choose SkillConnect?</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
              Every feature is built with one goal — making freelance work fair, fast, and frustration-free.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <div key={i} className="glass-card p-6 sm:p-7 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)" }}>
                    {f.icon}
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}>
                    {f.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-base sm:text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="page-content py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="section-label mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base">
              From searching to getting paid — the whole process takes minutes, not days.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
            {steps.map((step, i) => (
              <div key={i} className="glass-card p-6 sm:p-8 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(79,70,229,0.2))", border: "1px solid rgba(124,58,237,0.45)" }}>
                  <span className="text-xs font-bold leading-none" style={{ color: "#a78bfa" }}>{step.n}</span>
                  <span className="text-lg leading-none mt-0.5">{step.icon}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-base sm:text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="page-content py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="section-label mb-3">Real Reviews</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base">
              Hear from people who've already hired and worked through SkillConnect.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-6 sm:p-7 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => <span key={j} className="text-yellow-400 text-sm">★</span>)}
                </div>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: t.color }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="page-content py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden"
            style={{ background: "rgba(124,58,237,0.09)", borderColor: "rgba(124,58,237,0.3)" }}>
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.25), transparent)", filter: "blur(30px)" }} />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(79,70,229,0.2), transparent)", filter: "blur(24px)" }} />
            <span className="badge-violet mb-5 inline-flex">Join 12,000+ Users</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 relative">Ready to Start Your Journey?</h2>
            <p className="text-gray-400 mb-8 text-sm sm:text-base max-w-md mx-auto relative">
              Whether you're looking to hire top talent or grow your freelance career — SkillConnect is where it begins.
            </p>
            <div className="flex flex-wrap justify-center gap-3 relative">
              {role === "freelancer" ? (
                // Freelancer → dashboard only
                <Link to="/freelancer-dashboard"><button className="btn-primary px-8 py-3 text-sm sm:text-base">Go to Dashboard →</button></Link>
              ) : (
                // Not a freelancer (signed in or not) → always show both options
                <>
                  <Link to="/services"><button className="btn-primary px-7 py-3 text-sm sm:text-base">🚀 Hire a Freelancer</button></Link>
                  <Link to="/freelancer-signup"><button className="btn-ghost px-7 py-3 text-sm sm:text-base">💼 Become a Freelancer</button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="page-content footer-gradient px-4 sm:px-6 pt-10 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-8">
            <div className="text-center sm:text-left">
              <h3 className="text-white font-bold text-lg mb-1">SkillConnect</h3>
              <p className="text-gray-500 text-xs max-w-xs">Connecting talent with opportunity across India. Fair fees, fast payments, real results.</p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2 text-xs text-gray-500">
              <Link to="/aboutus"  className="hover:text-white transition-colors">About</Link>
              <Link to="/services" className="hover:text-white transition-colors">Services</Link>
              <Link to="/contact"  className="hover:text-white transition-colors">Contact</Link>
              <Link to="/pp"       className="hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
          <div className="section-divider mb-6" style={{ maxWidth: "100%" }} />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
            <p>© 2026 SkillConnect. All rights reserved.</p>
            <p style={{ color: "#a78bfa" }}>Made with ❤️ by Vikneshwaran</p>
          </div>
        </div>
      </footer>

      <ChatBot sendMessage={sendMessage} />
    </div>
  );
}