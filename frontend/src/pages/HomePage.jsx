import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function HomePage() {
  const [showHireOptions, setShowHireOptions] = useState(false);
  const { isSignedIn } = useUser(); // 👈 Clerk hook

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col sm:flex-col items-start sm:items-center justify-start sm:justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden py-20 sm:py-32 md:py-48">
        <h1 className="absolute text-[3rem] sm:text-[5rem] md:text-[8rem] lg:text-[12rem] font-extrabold text-gray-300 tracking-widest select-none text-center w-full z-0">
          FREELANCER
        </h1>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 mt-0 sm:mt-7 w-full">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-snug">
            Hire Freelancers.{" "}
            <span className="text-indigo-600">Get Work Done Easily.</span>
          </h2>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto px-2">
            Find trusted freelancers for{" "}
            <span className="text-indigo-600 font-semibold">technical</span> and{" "}
            <span className="text-indigo-600 font-semibold">non-technical</span>{" "}
            tasks with{" "}
            <span className="text-indigo-600 font-semibold">lowest fees</span>{" "}
            and{" "}
            <span className="text-indigo-600 font-semibold">quick booking</span>.
          </p>

          {/* Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-4">
            {!isSignedIn ? (
              // 🔹 Not logged in
              <>
                <Link
                  to="/services"
                  className="px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1"
                >
                  Find a Freelancer
                </Link>
                <Link
                  to="/categories"
                  className="px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition transform hover:-translate-y-1"
                >
                  Explore Services
                </Link>
              </>
            ) : showHireOptions ? (
              // 🔹 Logged in + clicked "Hire a Freelancer"
              <>
                <Link
                  to="/services"
                  className="px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1"
                >
                  Find a Freelancer
                </Link>
                <Link
                  to="/categories"
                  className="px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition transform hover:-translate-y-1"
                >
                  Explore Services
                </Link>
              </>
            ) : (
              // 🔹 Logged in but showing options
              <>
                <button
                  onClick={() => setShowHireOptions(true)}
                  className="px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 transition transform hover:-translate-y-1"
                >
                  Hire a Freelancer
                </button>
                <Link
                  to="/freelancer-signup"
                  className="px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition transform hover:-translate-y-1"
                >
                  Become a Freelancer
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 👇 keep your Services, Projects, Testimonials, Contact, Footer unchanged */}
    </div>
  );
}

export default HomePage;
