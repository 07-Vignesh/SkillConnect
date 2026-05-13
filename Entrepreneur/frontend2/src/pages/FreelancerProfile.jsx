import { useState } from "react";

// shadcn
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FaUserEdit } from "react-icons/fa";

export default function FreelancerProfile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@gmail.com",
    skills: "React, Node.js, UI/UX",
    category: "Technical",
  });

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setSuccess("Profile updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="min-h-screen relative px-6 py-12">

      {/* 🔥 BACKGROUND */}
      <div className="grid-background"></div>
      <div className="absolute inset-0 bg-black/90 z-0"></div>

      <div className="page-content max-w-3xl mx-auto space-y-6">

        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-3">
          <FaUserEdit className="text-primary w-6 h-6" />
          <h1 className="text-3xl font-bold text-white">
            Edit Profile
          </h1>
        </div>

        {/* ✅ SUCCESS */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-md text-sm">
            {success}
          </div>
        )}

        {/* ================= PROFILE CARD ================= */}
        <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
          <CardContent className="pt-6 space-y-6">

            {/* 🔥 AVATAR */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-white">
                {profile.name.charAt(0)}
              </div>
              <p className="mt-2 text-gray-400 text-sm">
                Profile Preview
              </p>
            </div>

            {/* ================= FORM ================= */}

            {/* NAME */}
            <div>
              <label className="text-sm text-gray-400">
                Full Name
              </label>
              <Input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-400">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* SKILLS */}
            <div>
              <label className="text-sm text-gray-400">
                Skills
              </label>
              <textarea
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-gray-500"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-sm text-gray-400">
                Category
              </label>
              <select
                name="category"
                value={profile.category}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-white/5 border border-white/10 text-white"
              >
                <option>Technical</option>
                <option>Non-Technical</option>
              </select>
            </div>

            {/* 🔥 BUTTON */}
            <Button
              onClick={handleSave}
              className="w-full"
            >
              Save Changes
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}