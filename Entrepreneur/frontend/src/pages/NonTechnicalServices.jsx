import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NonTechnicalServices() {
  const [freelancers, setFreelancers] = useState([]);
  const [linkedin, setLinkedin] = useState([]);
  const [loading, setLoading] = useState(false);

  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const handleSearch = async () => {
    if (!city) return;

    try {
      setLoading(true);

      let url = `http://localhost:5000/api/freelancers/location?city=${encodeURIComponent(
        city
      )}`;

      if (pincode) {
        url += `&pincode=${encodeURIComponent(pincode)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      setFreelancers(data.platformFreelancers || []);
      setLinkedin(data.suggestedFreelancers || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative px-6 py-16">

      {/* 🔥 GRID */}
      <div className="grid-background"></div>

      {/* 🔥 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/90 -z-10"></div>

      {/* 🔥 TITLE */}
      <div className="text-center mb-12">
        <h2 className="text-primary text-xl font-semibold mb-2">
          Your Task, Their Talent
        </h2>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Find Nearby Freelancers
        </h1>
      </div>

      {/* 🔥 SEARCH BOX */}
      <div className="max-w-xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-12 shadow-xl">

        <label className="text-sm text-gray-300">City</label>
        <input
          type="text"
          placeholder="Enter City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full mt-2 mb-4 px-4 py-2 rounded-md bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none"
        />

        <label className="text-sm text-gray-300">
          Pincode (Optional)
        </label>
        <input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="w-full mt-2 mb-4 px-4 py-2 rounded-md bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none"
        />

        <Button onClick={handleSearch} className="w-full">
          Find Freelancers
        </Button>
      </div>

      {/* 🔥 FREELANCERS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {loading ? (
          <p className="text-center text-gray-400 col-span-3">
            Loading freelancers...
          </p>
        ) : freelancers.length > 0 ? (
          freelancers.map((f) => (
            <Link
              key={f._id}
              to={`/freelancer/${f._id}`}
              className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-lg hover:scale-105 hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold text-white">
                {f.name}
              </h2>

              <p className="text-gray-400">{f.category}</p>

              <p className="text-gray-500 text-sm">
                {f.city} - {f.pincode || "N/A"}
              </p>

              <p className="text-lg font-bold mt-2 text-primary">
                ₹{f.price}
              </p>
            </Link>
          ))
        ) : (
          !loading && (
            <p className="text-center text-gray-500 col-span-3">
              No freelancers found. Try another city.
            </p>
          )
        )}
      </div>

      {/* 🔥 LINKEDIN SECTION */}
      {linkedin.length > 0 && (
        <div className="mt-20">

          <h2 className="text-2xl font-bold text-center text-white mb-8">
            Suggested Professionals
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {linkedin.map((f, index) => (
              <a
                key={index}
                href={f.profile}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-lg hover:scale-105 transition"
              >
                <img
                  src={f.profilePicture || "/default-avatar.png"}
                  alt={f.name}
                  className="w-16 h-16 rounded-full mb-3 border border-white/10"
                />

                <h2 className="text-lg font-semibold text-white">
                  {f.name}
                </h2>

                <p className="text-gray-400 text-sm">
                  {f.category}
                </p>

                <p className="text-gray-500 text-xs">
                  {f.city}
                </p>

                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded mt-2 inline-block">
                  LinkedIn Professional
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}