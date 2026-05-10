import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import hiBot from "../assets/man-waiving-hand.json";
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= PARSER =================
  const parseFreelancers = (text) => {
    const results = [];

    freelancersData.forEach((freelancer) => {
      if (
        text.toLowerCase().includes(freelancer.name.toLowerCase())
      ) {
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

      const newMessages = [];

      if (botResponse.freelancer_answer) {
        const parsed = parseFreelancers(botResponse.freelancer_answer);

        newMessages.push({
          sender: "bot",
          type: "freelancers",
          freelancers: parsed,
        });
      }

      if (botResponse.support_answer) {
        newMessages.push({
          sender: "bot",
          type: "text",
          text: botResponse.support_answer,
        });
      }

      if (botResponse.general_answer) {
        newMessages.push({
          sender: "bot",
          type: "text",
          text: botResponse.general_answer,
        });
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

  // ================= PARSER =================
  const parseFreelancers = (text) => {
    const blocks = text.split("\n\n");

    return blocks.map((b, i) => {
      const name = b.match(/Name:\s*(.*)/)?.[1] || "Unknown";
      const category = b.match(/Category:\s*(.*)/)?.[1] || "";
      const city = b.match(/City:\s*(.*)/)?.[1] || "";
      const rating = b.match(/Rating:\s*(.*)/)?.[1] || "";

      return {
        _id: i,
        name,
        category,
        city,
        rating,
      };
    });
  };

  // ================= RESIZE =================
  const handleMouseMove = (e) => {
    if (isResizingSidebar) {
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

  // ================= UI =================
  return (
    <>
      {/* 💬 FLOAT BUTTON */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 z-50 flex items-center justify-center cursor-pointer transition-all duration-300"
        style={{
          right: isOpen ? width + 24 : 24, // 🔥 THIS IS THE MAGIC
        }}
      >
        <div className="relative w-14 h-14 rounded-full bg-white/70 shadow-lg flex items-center justify-center hover:scale-110 transition">

          {/* 🔥 PULSE EFFECT */}
          <span className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></span>

          {/* 🤖 LOTTIE / EMOJI */}
          <div className="w-10 h-10 z-10">
            <Lottie animationData={hiBot} loop />
          </div>
        </div>
      </div>

      {/* 🔥 SIDEBAR */}
      <div
        className={`fixed top-[68px] right-0 z-40 h-[calc(100vh-68px)] 
        bg-black/80 backdrop-blur-xl border-l border-white/10
        flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width }}
      >
        {/* RESIZE HANDLE */}
        <div
          className="absolute left-0 w-2 h-full cursor-ew-resize"
          onMouseDown={() => setIsResizingSidebar(true)}
        />

        {/* HEADER */}
        <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
          <h2 className="font-semibold text-white">
            Sync AI ©
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-white">⨉</button>
        </div>

        {/* ================= MESSAGES ================= */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.sender === "user" ? "text-right" : ""}
            >

              {/* TEXT */}
              {m.type === "text" && (
                <span
                  className={`inline-block px-4 py-2 rounded-xl text-sm max-w-[80%] ${
                    m.sender === "user"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {m.text}
                </span>
              )}

              {/* FREELANCERS */}
              {m.type === "freelancers" && (
                <div className="grid gap-4 mt-2">

                  {m.freelancers.map((f) => (
                    <div
                      key={f._id || f.id}
                      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 
                      hover:scale-105 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
                    >
                      <CardContent className="pt-4">
                        <h3 className="font-semibold text-white">
                          {f.name}
                        </h3>

                        <p className="text-sm text-gray-400">
                          {f.category}
                        </p>

                        <p className="text-sm text-gray-300">
                          {f.city}
                        </p>

                        <p className="text-xs text-gray-400">
                          ⭐ {f.rating}
                        </p>

                        <Link to="/services">
                          <Button size="sm" className="mt-3 w-full">
                            View Profile
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}

                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <p className="text-sm text-gray-400">🤖 Thinking...</p>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ================= INPUT ================= */}
        <div className="p-3 border-t border-white/10 flex gap-2">

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="bg-white/5 border-white/10 text-white"
            onKeyDown={(e) =>
              e.key === "Enter" && handleSend()
            }
          />

          <Button onClick={handleSend} className="text-white">
            Send
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChatBot;