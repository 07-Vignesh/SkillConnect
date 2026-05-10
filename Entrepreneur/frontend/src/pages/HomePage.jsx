import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import banner4 from "../assets/banner4.jpeg";
import blueCollar from "../assets/blueCollar.jpeg";
import whiteCollar from "../assets/whiteCollar.jpeg";
import { useState, useEffect } from "react";

function HomePage() {
  const { isSignedIn } = useUser();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!isSignedIn) {
      setRole("");
      localStorage.removeItem("role");
    } else {
      const userRole = localStorage.getItem("role");
      setRole(userRole || "");
    }
  }, [isSignedIn]);

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* 🔥 GRID BACKGROUND */}
      <div className="grid-background"></div>

      {/* 🔥 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/90 -z-10"></div>

      {/* ================= HERO ================= */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center py-32 px-6">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Hire Freelancers <br />
            <span className="bg-gradient-to-r from-gray-200 via-gray-400 to-gray-500 bg-clip-text text-transparent">
              Smarter. Faster. Better.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            Connect with top freelancers for both technical and non-technical work.
            Powered by AI for faster hiring and better results.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {!isSignedIn ? (
              <>
                <Link to="/services">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200 transition">
                    Hire a Freelancer
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    Explore Services
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/services">
                  <Button size="lg" className="bg-white text-black">
                    Hire a Freelancer
                  </Button>
                </Link>
                <Link to="/UserBooking">
                  <Button size="lg" className="bg-gray-800 text-white hover:bg-gray-700">
                    My Bookings
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button variant="outline" size="lg" className="border-white text-white">
                    Explore Services
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t rounded-xl"></div>
            <img
              src={banner4}
              alt="Freelancer Platform"
              className="rounded-xl shadow-2xl border border-white/10 mx-auto max-w-5xl w-full"
            />
          </div>
        </div>
      </section>

      {/* ================= JOB TYPES ================= */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Opportunities for Everyone
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Whether you're a skilled professional or a hands-on worker, SkillConnect connects you to the right opportunities.
          </p>
          <div className="grid md:grid-cols-2 gap-10 mt-16">
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 hover:border-white/20 transition">
              <img src={whiteCollar} alt="White Collar Jobs" className="rounded-lg mb-4 h-52 w-full object-cover" />
              <h3 className="text-xl font-semibold text-white">White Collar Jobs</h3>
              <p className="text-gray-400 mt-2">
                Developers, Designers, Marketers, Analysts and more. Work remotely or on-site with top clients.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 hover:border-white/20 transition">
              <img src={blueCollar} alt="Blue Collar Jobs" className="rounded-lg mb-4 h-52 w-full object-cover" />
              <h3 className="text-xl font-semibold text-white">Blue Collar Jobs</h3>
              <p className="text-gray-400 mt-2">
                Electricians, Plumbers, Drivers, Technicians and more. Find trusted local work instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-10 mt-16">
            <div className="p-6 border border-white/10 rounded-xl bg-white/5">
              <h3 className="text-white text-xl font-semibold">1. Search</h3>
              <p className="text-gray-400 mt-2">Find freelancers based on skills, location, and category.</p>
            </div>
            <div className="p-6 border border-white/10 rounded-xl bg-white/5">
              <h3 className="text-white text-xl font-semibold">2. Connect</h3>
              <p className="text-gray-400 mt-2">Chat, compare, and choose the best freelancer for your job.</p>
            </div>
            <div className="p-6 border border-white/10 rounded-xl bg-white/5">
              <h3 className="text-white text-xl font-semibold">3. Get Work Done</h3>
              <p className="text-gray-400 mt-2">Secure payments and smooth workflow management.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-black/[0.03] via-3% to-black/100 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Start Your Freelance Journey Today
        </h2>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          Join thousands of freelancers and clients already growing with SkillConnect.
        </p>
        <div className="mt-8 flex justify-center items-center w-full">
          {role === "freelancer" ? (
            <Link to="/services">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                Get Started
              </Button>
            </Link>
          ) : (
            <div className="flex gap-4">
              <Link to="/services">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                  Get Started
                </Button>
              </Link>
              <Link to="/freelancer-signup">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/70">
                  Become Freelancer
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

export default HomePage;