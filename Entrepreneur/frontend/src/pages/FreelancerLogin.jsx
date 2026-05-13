import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// shadcn
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FreelancerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("freelancerId", data.freelancer._id);
        localStorage.setItem("role", "freelancer");
        window.dispatchEvent(new Event("roleChanged"));
        setTimeout(() => navigate("/freelancer-dashboard"), 100);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">

      {/* 🔥 BACKGROUND */}
      <div className="grid-background"></div>
      <div className="absolute inset-0 bg-black/90 z-0"></div>

      {/* ================= CARD ================= */}
      <Card className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
        <CardContent className="pt-6 space-y-6">

          {/* 🔥 HEADER */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">
              Freelancer Login
            </h2>
            <p className="text-sm text-gray-400">
              Access your dashboard
            </p>
          </div>

          {/* ❌ ERROR */}
          {error && (
            <p className="text-red-400 text-sm text-center">
              {error}
            </p>
          )}

          {/* 🔥 FORM */}
          <form onSubmit={handleLogin} className="space-y-4">

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />

            <Button className="w-full">
              Login
            </Button>

          </form>

          {/* 🔗 EXTRA */}
          <p className="text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <a
              href="/freelancer-signup"
              className="text-primary hover:underline"
            >
              Sign up
            </a>
          </p>

        </CardContent>
      </Card>
    </div>
  );
}