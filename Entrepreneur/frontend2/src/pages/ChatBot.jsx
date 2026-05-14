import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import hiBot from "../assets/man-waiving-hand.json";
import freelancersData from "../datas/freelancers.json";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatBot = ({ sendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState(380);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const messagesEndRef = useRef(null);

  const isMobile = viewportWidth < 640;

  // ── Track viewport width ─────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Lock body scroll on mobile when open ─────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isMobile && isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, isMobile]);

  // ── Parser ───────────────────────────────────────────────────────────────
  const parseFreelancers = (text) =>
    freelancersData.filter((f) =>
      text.toLowerCase().includes(f.name.toLowerCase())
    );

  // ── Send ─────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", type: "text", text: input }]);
    setInput("");
    setIsLoading(true);
    try {
      const botResponse = await sendMessage(input);
      const responseText =
        botResponse.general_answer ||
        botResponse.support_answer ||
        botResponse.freelancer_answer ||
        botResponse.reply || "";

      const isFreelancerReply =
        responseText.toLowerCase().includes("name:") ||
        responseText.includes("**Name**");
      const parsed = isFreelancerReply ? parseFreelancers(responseText) : [];

      setMessages((prev) => [
        ...prev,
        parsed.length > 0
          ? { sender: "bot", type: "freelancers", freelancers: parsed }
          : { sender: "bot", type: "text", text: responseText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", text: "❌ Error processing request" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Desktop resize drag ───────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      if (!isResizingSidebar || isMobile) return;
      const next = window.innerWidth - e.clientX;
      if (next >= 320 && next <= 600) setWidth(next);
    };
    const stop = () => setIsResizingSidebar(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", stop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", stop);
    };
  }, [isResizingSidebar, isMobile]);

  // ── Panel style ───────────────────────────────────────────────────────────
  // Mobile  → covers the ENTIRE screen (top:0, full width+height)
  // Desktop → right sidebar from below the navbar
  const panelStyle = isMobile
    ? { top: 0, left: 0, right: 0, bottom: 0, width: "100dvw", height: "100dvh" }
    : { top: "68px", right: 0, width, height: "calc(100dvh - 68px)" };

  return (
    <>
      {/* ── FAB — hidden while mobile chat is open so it never overlaps input ── */}
      {!(isMobile && isOpen) && (
        <div
          onClick={() => setIsOpen((v) => !v)}
          className="fixed bottom-6 z-50 flex items-center justify-center cursor-pointer"
          style={{
            right: isMobile ? 16 : isOpen ? width + 24 : 16,
            transition: "right 0.3s",
          }}
        >
          <div className="relative w-14 h-14 rounded-full bg-white/70 shadow-lg flex items-center justify-center hover:scale-110 transition">
            <span className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping" />
            <div className="w-10 h-10 z-10">
              <Lottie animationData={hiBot} loop />
            </div>
          </div>
        </div>
      )}

      {/* ── Chat panel ── */}
      <div
        className={`fixed z-50 flex flex-col bg-black/95 backdrop-blur-xl
          ${isMobile ? "" : "border-l border-white/10"}
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={panelStyle}
      >
        {/* Desktop-only resize handle */}
        {!isMobile && (
          <div
            className="absolute left-0 top-0 w-2 h-full cursor-ew-resize z-10"
            onMouseDown={() => setIsResizingSidebar(true)}
          />
        )}

        {/* ── Header — fixed height, never shrinks ── */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-4 border-b border-white/10"
          style={{ height: 56 }}
        >
          <span className="font-semibold text-white text-sm tracking-wide">
            Sync AI ©
          </span>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition text-xl leading-none"
          >
            ⨉
          </button>
        </div>

        {/* ── Messages
              flex-1 + min-h-0 is critical:
              it lets this area shrink so the input bar is NEVER pushed off screen ── */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pt-4 pb-2 space-y-3"
        >
          {messages.length === 0 && (
            <p className="text-gray-500 text-sm text-center mt-10">
              👋 Hi! How can I help you today?
            </p>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* Text bubble */}
              {m.type === "text" && (
                <span
                  className={`px-4 py-2 rounded-2xl text-sm leading-relaxed break-words
                    ${isMobile ? "max-w-[88%]" : "max-w-[80%]"}
                    ${m.sender === "user"
                      ? "bg-white text-black rounded-br-sm"
                      : "bg-white/10 text-white rounded-bl-sm"
                    }`}
                >
                  {m.text}
                </span>
              )}

              {/* Freelancer cards */}
              {m.type === "freelancers" && (
                <div className="w-full grid gap-3">
                  {m.freelancers.map((f) => (
                    <div
                      key={f._id || f.id}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2"
                    >
                      <p className="text-white font-semibold text-sm">{f.name}</p>
                      <p className="text-gray-400 text-xs">{f.subcategory || f.category}</p>
                      <p className="text-gray-500 text-xs">
                        📍 {f.location?.city || f.city} –{" "}
                        {f.location?.pincode || f.pincode || "N/A"}
                      </p>
                      <p className="text-yellow-400 text-xs">⭐ {f.rating || 4.5}</p>
                      <div className="flex items-center justify-between pt-1">
                        <p className="text-white font-bold text-base">
                          ₹{f.pricing?.amount || f.price}
                        </p>
                        <Link to={`/freelancer/${f._id || f.id}`}>
                          <Button size="sm" className="text-white text-xs h-8 px-3">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <p className="text-sm text-gray-400 animate-pulse">🤖 Thinking...</p>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input bar
              flex-shrink-0  → never collapses
              bg-black/95    → solid bg so nothing shows through
              safe-area pb   → handles iPhone home bar
              The Send button has a fixed width so it never gets cut off ── */}
        <div
          className="flex-shrink-0 flex items-center gap-2 bg-black/95 border-t border-white/10 px-3"
          style={{
            minHeight: 64,
            paddingTop: 10,
            paddingBottom: "max(10px, env(safe-area-inset-bottom, 10px))",
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask something..."
            className="flex-1 min-w-0 bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-sm h-10"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{ flexShrink: 0, minWidth: 64, height: 40 }}
            className="text-white text-sm px-4"
          >
            Send
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChatBot;