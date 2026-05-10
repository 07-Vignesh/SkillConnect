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
              { name: "Iklash Ahamed", role: "Founder & CEO", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brian" },
              { name: "Vignesh", role: "Head of Operations", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya" },
              { name: "Pranav", role: "Tech Lead", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit" },
            ].map((member, i) => (
              <Card
                key={i}
                className="bg-white/5 border-white/10 hover:border-white/30 transition backdrop-blur"
              >
                <CardContent className="pt-6 text-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-white/20"
                  />

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
          {[
            { name: "Hareesh", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
            { name: "Karthick", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
            { name: "Arun", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
          ].map((client) => (
            <div
              key={client.name}
              className="w-32 h-32 bg-white/5 border border-white/10 rounded-md flex flex-col items-center justify-center hover:border-white/30 transition"
            >
              <img 
                src={client.image} 
                alt={client.name}
                className="w-16 h-16 rounded-full mb-2 border-2 border-white/20"
              />
              <span className="text-sm text-gray-400">{client.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 text-center py-6 text-gray-500">
        © 2026 Unitoids. All rights reserved.
      </footer>
    </div>
  );
}

export default AboutUs;