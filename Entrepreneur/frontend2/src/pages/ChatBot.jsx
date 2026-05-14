import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import hiBot from "../assets/man-waiving-hand.json";
import freelancersData from "../datas/freelancers.json";

// shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatBot = ({ sendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [width, setWidth] = useState(380);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);

  const messagesEndRef = useRef(null);

  // ================= DETECT MOBILE =================
  const isMobile = () => window.innerWidth < 768;

  // ================= SCROLL =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= LOCK BODY SCROLL ON MOBILE =================
  useEffect(() => {
    if (isMobile()) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ================= PARSER =================
  const parseFreelancers = (text) => {
    const results = [];
    freelancersData.forEach((freelancer) => {
      if (text.toLowerCase().includes(freelancer.name.toLowerCase())) {
        results.push(freelancer);
      }
    });
    return results;
  };

  // ================= SEND =================
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", type: "text", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const botResponse = await sendMessage(input);

      const responseText =
        botResponse.general_answer ||
        botResponse.support_answer ||
        botResponse.freelancer_answer ||
        botResponse.reply ||
        "";

      const newMessages = [];

      if (
        responseText.toLowerCase().includes("name:") ||
        responseText.includes("**Name**")
      ) {
        const parsed = parseFreelancers(responseText);
        if (parsed.length > 0) {
          newMessages.push({ sender: "bot", type: "freelancers", freelancers: parsed });
        } else {
          newMessages.push({ sender: "bot", type: "text", text: responseText });
        }
      } else {
        newMessages.push({ sender: "bot", type: "text", text: responseText });
      }

      setMessages((prev) => [...prev, ...newMessages]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", text: "❌ Error processing request" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ================= RESIZE (desktop only) =================
  const handleMouseMove = (e) => {
    if (isResizingSidebar && !isMobile()) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 320 && newWidth <= 600) {
        setWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    const stop = () => setIsResizingSidebar(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stop);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stop);
    };
  });

  // ================= COMPUTED STYLES =================
  // On mobile: full screen overlay. On desktop: sidebar panel.
  const sidebarStyle = isMobile()
    ? { width: "100vw", left: 0, right: 0 }
    : { width, right: 0 };

  const floatButtonStyle = isMobile()
    ? { right: 16 }
    : { right: isOpen ? width + 24 : 24 };

  // ================= UI =================
  return (
    <>
      {/* 💬 FLOAT BUTTON */}
      {/* Hide float button on mobile when chat is open (close button inside handles it) */}
      {!(isMobile() && isOpen) && (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 z-50 flex items-center justify-center cursor-pointer transition-all duration-300"
          style={floatButtonStyle}
        >
          <div className="relative w-14 h-14 rounded-full bg-white/70 shadow-lg flex items-center justify-center hover:scale-110 transition">
            <span className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></span>
            <div className="w-10 h-10 z-10">
              <Lottie animationData={hiBot} loop />
            </div>
          </div>
        </div>
      )}

      {/* 🔥 SIDEBAR / MOBILE FULLSCREEN */}
      <div
        className={`fixed z-40 flex flex-col
          bg-black/90 backdrop-blur-xl border-l border-white/10
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          ${isMobile()
            ? "top-0 h-screen"           // full screen on mobile
            : "top-[68px] h-[calc(100vh-68px)]"  // sidebar on desktop
          }`}
        style={sidebarStyle}
      >
        {/* RESIZE HANDLE — desktop only */}
        {!isMobile() && (
          <div
            className="absolute left-0 w-2 h-full cursor-ew-resize"
            onMouseDown={() => setIsResizingSidebar(true)}
          />
        )}

        {/* HEADER */}
        <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center flex-shrink-0">
          <h2 className="font-semibold text-white text-base">Sync AI ©</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white text-xl leading-none hover:opacity-70 transition p-1"
            aria-label="Close chat"
          >
            ⨉
          </button>
        </div>

        {/* ================= MESSAGES ================= */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
          {messages.length === 0 && (
            <p className="text-gray-500 text-sm text-center mt-8">
              👋 Hi! How can I help you today?
            </p>
          )}

          {messages.map((m, i) => (
            <div key={i} className={m.sender === "user" ? "text-right" : ""}>
              {/* TEXT */}
              {m.type === "text" && (
                <span
                  className={`inline-block px-4 py-2 rounded-xl text-sm max-w-[85%] break-words leading-relaxed ${
                    m.sender === "user"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {m.text}
                </span>
              )}

              {/* FREELANCER CARDS */}
              {m.type === "freelancers" && (
                <div className="grid gap-3 mt-2">
                  {m.freelancers.map((f) => (
                    <div
                      key={f._id || f.id}
                      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4
                        hover:bg-white/10 transition duration-300 flex flex-col justify-between"
                    >
                      {/* TOP */}
                      <div>
                        <h2 className="text-base font-semibold text-white leading-tight">
                          {f.name}
                        </h2>
                        <p className="text-gray-400 text-sm mt-0.5">
                          {f.subcategory || f.category}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          📍 {f.location?.city || f.city} -{" "}
                          {f.location?.pincode || f.pincode || "N/A"}
                        </p>
                        <p className="text-yellow-400 text-xs mt-1">
                          ⭐ {f.rating || 4.5}
                        </p>
                      </div>

                      {/* BOTTOM */}
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-base font-bold text-white">
                          ₹{f.pricing?.amount || f.price}
                        </p>
                        <Link to={`/freelancer/${f._id || f.id}`}>
                          <Button size="sm" className="text-white text-xs px-3 py-1">
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

        {/* ================= INPUT ================= */}
        <div className="p-3 border-t border-white/10 flex gap-2 flex-shrink-0 safe-area-pb">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-sm flex-1 min-w-0"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="text-white flex-shrink-0 px-4"
          >
            Send
          </Button>
        </div>
      </div>

      {/* MOBILE BACKDROP — tap outside to close */}
      {isOpen && isMobile() && (
        <div
          className="fixed inset-0 z-30 bg-black/40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ChatBot;