import React from "react";
import { Card, CardContent } from "@/components/ui/card";

function PrivacyPolicy() {
  return (
    <div className="min-h-screen relative text-foreground">

      {/* 🔥 GRID */}
      <div className="grid-background"></div>

      {/* 🔥 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/90 -z-10"></div>

      {/* ================= HERO ================= */}
      <section className="text-center py-24 px-6 relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
          Privacy Policy
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
          Your privacy matters to us. Learn how we collect, use, and protect your data.
        </p>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">

          {[
            {
              title: "1. Introduction",
              content:
                "At SkillConnect, we value your privacy. This policy explains how we handle your personal information when you use our platform.",
            },
            {
              title: "2. Information We Collect",
              content: [
                "Personal details like name, email, phone number.",
                "Payment details for secure transactions.",
                "Profile info (skills, portfolio, work history).",
                "Usage data like login times and preferences.",
              ],
            },
            {
              title: "3. How We Use Your Data",
              content: [
                "Match freelancers with clients.",
                "Process secure payments.",
                "Improve platform performance.",
                "Prevent fraud and ensure safety.",
              ],
            },
            {
              title: "4. Sharing of Information",
              content:
                "We do not sell your data. It is only shared with trusted services like payment gateways.",
            },
            {
              title: "5. Data Security",
              content:
                "We use encryption, secure servers, and audits to protect your data.",
            },
            {
              title: "6. Your Rights",
              content: (
                <>
                  You can access, update, or delete your data anytime via{" "}
                  <span className="text-primary font-semibold">
                    support@SkillConnect.com
                  </span>
                </>
              ),
            },
            {
              title: "7. Updates",
              content:
                "We may update this policy. Changes will be posted on this page.",
            },
            {
              title: "8. Contact",
              content: [
                "Email: support@SkillConnect.com",
                "Phone: +91 8925615178",
              ],
            },
          ].map((section, i) => (
            <Card
              key={i}
              className="bg-white/5 border border-white/10 backdrop-blur-lg hover:shadow-xl hover:scale-[1.01] transition"
            >
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {section.title}
                </h3>

                {Array.isArray(section.content) ? (
                  <ul className="space-y-2 text-gray-400 text-sm">
                    {section.content.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {section.content}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center py-8 text-gray-500 text-sm relative z-10 border-t border-white/10">
        © 2026 SkillConnect. All rights reserved.
      </footer>
    </div>
  );
}

export default PrivacyPolicy;