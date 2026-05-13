import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// shadcn
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function FreelancerSignup() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");

  // ================= CATEGORY =================
const handleCategorySelect = (cat) => {
  setCategory(cat);

  localStorage.setItem("role", "freelancer");

  // 🔥 ADD THIS (IMPORTANT)
  window.dispatchEvent(new Event("roleChanged"));

  navigate("/profile-setup", { state: { category: cat } });
};

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">

      {/* 🔥 BACKGROUND */}
      <div className="grid-background"></div>
      <div className="absolute inset-0 bg-black/90 z-0"></div>

      {/* ================= CARD ================= */}
      <Card className="page-content w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
        <CardContent className="pt-6 space-y-6">

          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">
              Freelancer Signup
            </h2>
            <p className="text-sm text-gray-400">
              Choose your category
            </p>
          </div>

          {/* ================= CATEGORY ================= */}
          <div className="space-y-4">

            <Button
              onClick={() => handleCategorySelect("Technical")}
              className="w-full border-white text-white hover:text-slate-200"
            >
              Technical
            </Button>

            <Button
              variant="outline"
              onClick={() => handleCategorySelect("Non-Technical")}
              className="w-full border-white/20 text-white"
            >
              Non-Technical
            </Button>

          </div>

        </CardContent>
      </Card>
    </div>
  );
}

export default FreelancerSignup;