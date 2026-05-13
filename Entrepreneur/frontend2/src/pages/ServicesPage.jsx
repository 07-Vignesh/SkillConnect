import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";

export default function ServicesPage() {
  const [freelancers, setFreelancers]         = useState([]);
  const [allFreelancers, setAllFreelancers]   = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [locationDenied, setLocationDenied]   = useState(false);
  const [city, setCity]                       = useState("");
  const [pincode, setPincode]                 = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories]           = useState([]);
  const [showFilters, setShowFilters]         = useState(false);

  const normalizeList = (data) => Array.isArray(data) ? data : data?.freelancers || [];
  const applyFilter   = (list, cat) => cat ? list.filter(f => (f.subcategory || f.category) === cat) : list;
  const refreshCats   = (list) => {
    const unique = [...new Set(list.map(f => f.subcategory || f.category).filter(Boolean))];
    setCategories(list.length > 0 ? unique : []);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res  = await fetch("http://localhost:5000/api/freelancers");
      const data = await res.json();
      const list = normalizeList(data);
      setAllFreelancers(list);
      setFreelancers(applyFilter(list, selectedCategory));
      refreshCats(list);
    } finally { setLoading(false); }
  };

  const fetchByLocation = async (userCity, userPincode) => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/freelancers/location?city=${encodeURIComponent(userCity)}`;
      if (userPincode) url += `&pincode=${encodeURIComponent(userPincode)}`;
      const res  = await fetch(url);
      const data = await res.json();
      const list = normalizeList(data);
      setAllFreelancers(list);
      setFreelancers(applyFilter(list, selectedCategory));
      refreshCats(list);
    } finally { setLoading(false); }
  };

  const fetchCityAndPincode = async (lat, lng) => {
    try {
      const res  = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_GOOGLE_API_KEY`);
      const data = await res.json();
      if (data.results?.length > 0) {
        const comps = data.results[0].address_components;
        return {
          city:    comps.find(c => c.types.includes("locality"))?.long_name    || "",
          pincode: comps.find(c => c.types.includes("postal_code"))?.long_name || "",
        };
      }
    } catch {}
    return { city: "", pincode: "" };
  };

  useEffect(() => {
    fetchAll();
    const detect = async () => {
      if (!("geolocation" in navigator)) { setLocationDenied(true); return; }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const loc = await fetchCityAndPincode(pos.coords.latitude, pos.coords.longitude);
          if (loc.city) { setCity(loc.city); setPincode(loc.pincode); }
          else setLocationDenied(true);
        },
        () => setLocationDenied(true)
      );
    };
    detect();
  }, []);

  const handleSearch         = () => { if (city) fetchByLocation(city, pincode); };
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
      <section className="page-content text-center py-20 sm:py-24 px-4 sm:px-6">
        <span className="badge-violet mb-6 inline-flex">Hire Talent</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
          Find <span className="accent-text">Freelancers</span>
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base mb-10">
          Discover skilled professionals near you. Filter by location, category, and more.
        </p>

        {/* SEARCH BAR */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-card flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 sm:p-3">
            <div className="flex items-center gap-2 flex-1 px-2">
              <MapPin size={16} className="text-violet-400 shrink-0" />
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Enter your city..."
                className="bg-transparent outline-none text-sm text-white placeholder:text-gray-500 flex-1"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowFilters(!showFilters)} className="btn-ghost text-xs px-3 py-2 gap-1.5">
                <SlidersHorizontal size={14} /> Filters
              </button>
              <button onClick={handleSearch} className="btn-primary text-xs sm:text-sm px-4 sm:px-6 py-2 gap-1.5 flex-1 sm:flex-none justify-center">
                <Search size={14} /> Search
              </button>
            </div>
          </div>

          {locationDenied && (
            <p className="mt-3 text-xs text-gray-500">📍 Location access denied. Enter your city manually.</p>
          )}

          {/* CATEGORY FILTERS */}
          {showFilters && categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => handleCategoryChange("")}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${selectedCategory === "" ? "bg-violet-600 border-violet-500 text-white" : "border-white/10 text-gray-400 hover:border-violet-500/50 hover:text-white"}`}
              >
                All
              </button>
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${selectedCategory === cat ? "bg-violet-600 border-violet-500 text-white" : "border-white/10 text-gray-400 hover:border-violet-500/50 hover:text-white"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RESULTS */}
      <section className="page-content px-4 sm:px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Finding freelancers...</p>
            </div>
          ) : freelancers.length === 0 ? (
            <div className="text-center py-20 glass-card p-12">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-300 font-medium mb-2">No freelancers found</p>
              <p className="text-gray-500 text-sm">Try a different city or clear the category filter.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-6">{freelancers.length} freelancer{freelancers.length !== 1 ? "s" : ""} found{city ? ` in ${city}` : ""}</p>
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {freelancers.map((f, i) => (
                  <Link key={f._id || f.id || i} to={`/freelancer/${f._id || f.id}`}>
                    <div className="glass-card p-5 sm:p-6 h-full group cursor-pointer">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-11 h-11 rounded-full bg-violet-800/40 border border-violet-600/30 flex items-center justify-center text-lg shrink-0 font-bold text-white">
                          {(f.name || f.fullName || "?")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-sm sm:text-base truncate">{f.name || f.fullName || "Freelancer"}</h3>
                          <p className="text-xs text-violet-400">{f.subcategory || f.category || "Professional"}</p>
                        </div>
                      </div>
                      {f.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {f.skills.slice(0, 3).map((s, j) => (
                            <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-violet-900/30 border border-violet-700/30 text-violet-300">{s}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin size={11} /> {f.city || (typeof f.location === "string" ? f.location : f.location?.city) || "—"}</span>
                        {f.rating && <span className="text-yellow-400">⭐ {f.rating}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <footer className="page-content footer-gradient text-center py-8 text-gray-500">
        <p className="text-sm">© 2026 SkillConnect. All rights reserved.</p>
        <p className="mt-1 text-xs" style={{ color: "#a78bfa" }}>Made with ❤️ by Vikneshwaran</p>
      </footer>
    </div>
  );
}
