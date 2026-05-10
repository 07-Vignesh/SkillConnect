import React from "react";
import { Card, CardContent } from "@/components/ui/card";

function AboutUs() {
  return (
    <div className="min-h-screen relative overflow-hidden text-foreground">

      {/* 🔥 GRID BACKGROUND */}
      <div className="grid-background"></div>

      {/* 🔥 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/90 -z-10"></div>

      {/* ================= HERO ================= */}
      <section className="relative z-10 text-center py-24 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
          About{" "}
          <span className="bg-gradient-to-r from-gray-200 via-gray-400 to-gray-500 bg-clip-text text-transparent">
            SkillConnect
          </span>
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
          Empowering freelancers and clients to connect seamlessly with
          fairness, trust, and instant rewards.
        </p>
      </section>

      {/* ================= STORY ================= */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">Our Story</h2>

          <p className="mt-6 text-gray-400 leading-relaxed text-lg">
            SkillConnect was built to empower students and part-time workers.
            We saw the struggles of high fees on other platforms and decided
            to create a system with fast payments and fair opportunities.
          </p>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="relative z-10 py-20 px-6 bg-white/5 backdrop-blur">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">Our Mission</h2>

          <p className="mt-6 text-gray-400 text-lg">
            Our mission is simple — connect talent with opportunities at the
            lowest fees while ensuring freelancers get paid instantly.
          </p>
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-10">
            Meet the Team
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Brian Jones", role: "Founder & CEO" },
              { name: "Ananya Sharma", role: "Head of Operations" },
              { name: "Rohit Patel", role: "Tech Lead" },
            ].map((member, i) => (
              <Card
                key={i}
                className="bg-white/5 border-white/10 hover:border-white/30 transition backdrop-blur"
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 mx-auto mb-4" />

                  <h3 className="font-semibold text-lg text-white">
                    {member.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {member.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SKILLS ================= */}
      <section className="relative z-10 py-20 px-6 bg-white/5 backdrop-blur">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-10">
            Our Expertise
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Web Development",
                desc: "React, Next.js, Node.js and scalable systems.",
              },
              {
                title: "Marketing",
                desc: "SEO, campaigns and content strategy.",
              },
              {
                title: "Design",
                desc: "UI/UX, branding and product design.",
              },
            ].map((skill, i) => (
              <Card
                key={i}
                className="bg-white/5 border-white/10 hover:border-white/30 transition backdrop-blur"
              >
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg text-white">
                    {skill.title}
                  </h3>
                  <p className="text-gray-400 mt-2">
                    {skill.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CLIENTS ================= */}
      <section className="relative z-10 py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-white">Trusted By</h2>

        <div className="mt-8 flex justify-center gap-6 flex-wrap">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-32 h-12 bg-white/5 border border-white/10 rounded-md flex items-center justify-center text-sm text-gray-400 hover:border-white/30 transition"
            >
              Client {i}
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 text-center py-6 text-gray-500">
        © 2026 SkillConnect. All rights reserved.
      </footer>
    </div>
  );
}

export default AboutUs;