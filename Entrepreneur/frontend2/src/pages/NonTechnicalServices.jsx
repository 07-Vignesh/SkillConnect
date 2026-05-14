import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { Link } from "react-router-dom";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";

export default function ServicesPage() {
  const [freelancers, setFreelancers] = useState([]);
  const [allFreelancers, setAllFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const normalizeList = (data) => Array.isArray(data) ? data : data?.freelancers || [];

  const applyFilter = (list, cat) => cat ? list.filter(f => (f.subcategory || f.category) === cat) : list;

  const refreshCategories = (list) => {
    const unique = [...new Set(list.map(f => f.subcategory || f.category).filter(Boolean))];
    setCategories(list.length > 0 ? unique : []);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/freelancers`);
      const data = await res.json();
      const list = normalizeList(data);
      setAllFreelancers(list);
      setFreelancers(applyFilter(list, selectedCategory));
      refreshCategories(list);
    } finally { setLoading(false); }
  };

  const fetchByLocation = async (userCity, userPincode) => {
    try {
      setLoading(true);
      let url = `${BACKEND_URL}/api/freelancers/location?city=${encodeURIComponent(userCity)}`;
      if (userPincode) url += `&pincode=${encodeURIComponent(userPincode)}`;
      const res = await fetch(url);
      const data = await res.json();
      const list = normalizeList(data);
      setAllFreelancers(list);
      setFreelancers(applyFilter(list, selectedCategory));
      refreshCategories(list);
    } finally { setLoading(false); }
  };

  const fetchCityAndPincode = async (lat, lng) => {
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?lat=${lat}&lng=${lng}&key=YOUR_GOOGLE_API_KEY`);
      const data = await res.json();
      if (data.results.length > 0) {
        const comps = data.results[0].address_components;
        return {
          city: comps.find(c => c.types.includes("locality"))?.long_name || "",
          pincode: comps.find(c => c.types.includes("postal_code"))?.long_name || "",
        };
      }
    } catch {}
    return { city: "", pincode: "" };
  };

  useEffect(() => {
    fetchAll();
    const detect = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const loc = await fetchCityAndPincode(pos.coords.latitude, pos.coords.longitude);
            if (loc.city) { setCity(loc.city); setPincode(loc.pincode); }
            else setLocationDenied(true);
          },
          () => setLocationDenied(true)
        );
      } else setLocationDenied(true);
    };
    detect();
  }, []);

  const handleSearch = () => { if (city) fetchByLocation(city, pincode); };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setFreelancers(applyFilter(allFreelancers, cat));
  };

  return (
    <div className="page-bg">
      <div className="grid-background" />
      <div className="bg-bloom-top" />
      <div className="bg-bloom-bottom" />
      <div className="bg-noise" />

      {/* HERO */}
      <section className="page-content text-center py-24 px-6">
        <span className="badge-violet mb-6 inline-flex">Hire Talent</span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
          Find <span className="accent-text">Freelancers</span>
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Discover skilled professionals near you for any task.
        </p>
      </section>

      {/* LOCATION SEARCH */}
      {locationDenied && (
        <div className="page-content max-w-lg mx-auto px-6 mb-8">
          <div className="glass-card p-6 space-y-4">
            <p className="text-sm text-gray-400 flex items-center gap-2"><MapPin size={14} className="text-violet-400" /> Enter your location to find nearby freelancers</p>
            <div className="flex gap-3">
              <input
                placeholder="City"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm text-white placeholder:text-gray-500 outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <input
                placeholder="Pincode"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                className="w-28 px-4 py-2.5 rounded-lg text-sm text-white placeholder:text-gray-500 outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>
            <button onClick={handleSearch} className="btn-primary w-full py-2.5 text-sm">
              <Search size={14} className="inline mr-2" />Find Freelancers
            </button>
          </div>
        </div>
      )}

      {/* CATEGORY FILTERS */}
      {categories.length > 0 && (
        <div className="page-content max-w-6xl mx-auto px-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange("")}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={selectedCategory === "" ? { background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white" } : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              All Services
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={selectedCategory === cat ? { background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white" } : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FREELANCER GRID */}
      <div className="page-content max-w-6xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Finding freelancers...</p>
          </div>
        ) : freelancers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {freelancers.map(f => (
              <Link key={f._id || f.id} to={`/freelancer/${f._id || f.id}`}>
                <div className="glass-card p-6 hover:-translate-y-1 transition-transform h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2))", color: "#c4b5fd" }}>
                        {(f.name || "?")[0]}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">{f.name}</h2>
                        <p className="text-xs" style={{ color: "#a78bfa" }}>{f.subcategory || f.category}</p>
                      </div>
                    </div>

                    {f.skills && f.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {f.skills.slice(0, 3).map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>{s}</span>
                        ))}
                      </div>
                    )}

                    {f.experience && <p className="text-gray-500 text-xs mb-2">📊 {f.experience}</p>}
                  </div>

                  <div className="pt-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <div>
                      {f.rating && <p className="text-yellow-400 text-xs mb-1">⭐ {f.rating} ({f.completedJobs || 0} jobs)</p>}
                      <p className="text-xl font-extrabold text-white">₹{f.pricing?.amount || f.price || "TBD"}</p>
                    </div>
                    <span className="text-violet-400 text-xs font-medium">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p>No freelancers found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
