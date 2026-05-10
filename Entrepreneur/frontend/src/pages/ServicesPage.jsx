import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// shadcn
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NonTechnicalServices() {
  const [freelancers, setFreelancers] = useState([]);
  const [allFreelancers, setAllFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const normalizeFreelancerList = (data) => {
    const list = Array.isArray(data) ? data : data?.freelancers || [];
    return list;
  };

  const applyCategoryFilter = (list, category) => {
    if (!category) return list;
    return list.filter(
      (freelancer) => (freelancer.subcategory || freelancer.category) === category
    );
  };

  const refreshCategories = (list) => {
    if (list.length > 0) {
      const uniqueCategories = [...new Set(list.map((freelancer) => freelancer.subcategory || freelancer.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } else {
      setCategories([]);
    }
  };

  const fetchAllFreelancers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/freelancers");
      const data = await res.json();
      const freelancerList = normalizeFreelancerList(data);

      setAllFreelancers(freelancerList);
      setFreelancers(applyCategoryFilter(freelancerList, selectedCategory));
      refreshCategories(freelancerList);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchFreelancersByLocation = async (userCity, userPincode) => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/freelancers/location?city=${encodeURIComponent(userCity)}`;
      if (userPincode) url += `&pincode=${encodeURIComponent(userPincode)}`;

      const res = await fetch(url);
      const data = await res.json();
      const freelancerList = normalizeFreelancerList(data);

      setAllFreelancers(freelancerList);
      setFreelancers(applyCategoryFilter(freelancerList, selectedCategory));
      refreshCategories(freelancerList);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchCityAndPincode = async (lat, lng) => {
    const API_KEY = "YOUR_GOOGLE_API_KEY";
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?lat=${lat}&lng=${lng}&key=${API_KEY}`
      );
      const data = await res.json();

      if (data.results.length > 0) {
        const comps = data.results[0].address_components;
        const cityComp = comps.find(c => c.types.includes("locality"));
        const pinComp = comps.find(c => c.types.includes("postal_code"));

        return {
          city: cityComp?.long_name || "",
          pincode: pinComp?.long_name || "",
        };
      }
    } catch (err) {
      // Error silently
    }
    return { city: "", pincode: "" };
  };

  useEffect(() => {
    fetchAllFreelancers();

    const detectLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const loc = await fetchCityAndPincode(
              pos.coords.latitude,
              pos.coords.longitude
            );

            if (loc.city) {
              setCity(loc.city);
              setPincode(loc.pincode);
            } else {
              setLocationDenied(true);
            }
          },
          () => {
            setLocationDenied(true);
          }
        );
      } else {
        setLocationDenied(true);
      }
    };

    detectLocation();
  }, []);

  const handleSearch = () => {
    if (city) fetchFreelancersByLocation(city, pincode);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFreelancers(applyCategoryFilter(allFreelancers, category));
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-foreground">

      {/* 🔥 GRID */}
      <div className="grid-background"></div>

      {/* 🔥 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/90 -z-10"></div>

      {/* ================= HERO ================= */}
      <section className="relative z-10 text-center py-20 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white">
          Find{" "}
          <span className="bg-gradient-to-r from-gray-200 via-gray-400 to-gray-500 bg-clip-text text-transparent">
            Freelancers
          </span>
        </h1>

        <p className="mt-6 text-gray-400 max-w-xl mx-auto">
          Discover skilled professionals near you for any task.
        </p>
      </section>

      {/* ================= SEARCH ================= */}
      {locationDenied && (
        <div className="relative z-10 max-w-xl mx-auto px-6 mb-10">
          <Card className="bg-white/5 border border-white/10 backdrop-blur">
            <CardContent className="pt-6 space-y-4">
              <Input
                placeholder="Enter City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
              <Input
                placeholder="Pincode (Optional)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
              <Button onClick={handleSearch} className="w-full text-white">
                Find Freelancers
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ================= CATEGORY FILTER ================= */}
      {freelancers.length > 0 && categories.length > 0 && (
        <div className="relative z-10 max-w-2xl mx-auto px-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                  handleCategoryChange("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === ""
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              All Services
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  handleCategoryChange(cat);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= CARDS ================= */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 pb-16">

        {loading ? (
          <p className="text-center text-gray-400 col-span-3">
            Loading freelancers...
          </p>
        ) : freelancers.length > 0 ? (
          freelancers.map((f) => (
            <Link key={f._id || f.id} to={`/freelancer/${f._id || f.id}`}>
              <Card className="bg-white/5 border border-white/10 backdrop-blur hover:border-white/30 transition hover:-translate-y-1 h-full">
                <CardContent className="p-6 flex flex-col justify-between h-full">

                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {f.name}
                    </h2>

                    <p className="text-blue-300 text-sm mt-1 font-medium">
                      {f.subcategory || f.category}
                    </p>

                    {f.skills && f.skills.length > 0 && (
                      <p className="text-gray-400 text-xs mt-2">
                        {f.skills.slice(0, 2).join(", ")}
                      </p>
                    )}

                    {f.experience && (
                      <p className="text-gray-400 text-xs mt-1">
                        📊 {f.experience}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    {f.rating && (
                      <p className="text-yellow-400 text-sm mb-2">
                        ⭐ {f.rating} ({f.completedJobs || 0} jobs)
                      </p>
                    )}

                    <p className="text-lg font-bold text-white">
                      ₹{f.pricing?.amount || f.price || "TBD"}
                    </p>
                    {f.pricing?.description && (
                      <p className="text-gray-400 text-xs mt-1">
                        {f.pricing.description}
                      </p>
                    )}
                  </div>

                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-3">
            No freelancers found.
          </p>
        )}
      </div>
    </div>
  );
}