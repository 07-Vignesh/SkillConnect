import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import freelancersData from "../datas/freelancers.json";
import { Search } from "lucide-react";

function getCategoryIcon(name) {
  const n = name.toLowerCase();
  if (n.includes("web"))       return "🌐";
  if (n.includes("app"))       return "📱";
  if (n.includes("design"))    return "🎨";
  if (n.includes("marketing")) return "📈";
  if (n.includes("writing"))   return "✍️";
  if (n.includes("video"))     return "🎬";
  if (n.includes("data"))      return "📊";
  if (n.includes("ai"))        return "🤖";
  if (n.includes("electric"))  return "⚡";
  if (n.includes("plumb"))     return "🔧";
  if (n.includes("drive"))     return "🚗";
  if (n.includes("clean"))     return "🧹";
  return "💼";
}

export default function CategoryPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [search, setSearch]         = useState("");

  useEffect(() => {
    const unique = [...new Set(freelancersData.map(f => f.subcategory || f.category))].filter(Boolean);
    setCategories(unique.map(name => ({ name })));
  }, []);

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-bg">
      <div className="grid-background" />
      <div className="bg-bloom-top" />
      <div className="bg-bloom-bottom" />
      <div className="bg-noise" />

      {/* HERO */}
      <section className="page-content text-center py-20 sm:py-24 px-4 sm:px-6">
        <span className="badge-violet mb-6 inline-flex">Browse All</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
          <span className="accent-text">Explore</span> Categories
        </h1>
        <p className="text-gray-400 max-w-md mx-auto mb-8 sm:mb-10 text-sm sm:text-base">
          Discover services across technical and non-technical domains
        </p>

        {/* SEARCH */}
  <div className="max-w-md mx-auto relative">
  <Search
    size={18}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
  />

  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search categories..."
    className="w-full h-14 bg-transparent border border-white/10 rounded-2xl text-white placeholder:text-gray-500 pl-12 pr-4 outline-none"
  />
</div>
      </section>

      {/* GRID */}
      <div className="page-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {filtered.map((cat, i) => (
          <button
            key={i}
            onClick={() => navigate(`/freelancers/${encodeURIComponent(cat.name)}`)}
            className="glass-card p-7 sm:p-8 text-center cursor-pointer w-full hover:-translate-y-1 transition-transform"
          >
            <div className="cat-icon">{getCategoryIcon(cat.name)}</div>
            <h2 className="text-sm sm:text-base font-bold text-white mb-1.5">{cat.name}</h2>
            <p className="text-xs text-gray-500">Explore professionals →</p>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-500">
            No categories found for "{search}"
          </div>
        )}
      </div>

      <footer className="page-content footer-gradient text-center py-8 text-gray-500">
        <p className="text-sm">© 2026 SkillConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}
