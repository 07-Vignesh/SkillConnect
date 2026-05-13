import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import freelancersData from "../datas/freelancers.json";

export default function Flproductcard() {
  const { categoryName } = useParams();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const decodedCategory = decodeURIComponent(categoryName).toLowerCase();
    const normalize = (v) => v.toLowerCase().replace(/\s+/g, "");
    const filtered = freelancersData.filter(f => {
      const cat = normalize(f.subcategory || f.category || "");
      const clicked = normalize(decodedCategory);
      const skills = (f.skills || []).map(normalize);
      return cat.includes(clicked) || clicked.includes(cat) || skills.some(s => s.includes(clicked));
    });
    setFreelancers(filtered);
    setLoading(false);
  }, [categoryName]);

  useEffect(() => {
    const fetchDB = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/freelancers/category/${encodeURIComponent(categoryName)}`);
        const dbData = await res.json();
        const db = Array.isArray(dbData) ? dbData : [];
        if (db.length > 0) setFreelancers(prev => [...prev, ...db]);
      } catch {}
    };
    if (freelancers.length > 0) fetchDB();
  }, [categoryName]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#080810" }}>
      <div className="grid-background" />
      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(124,58,237,0.15) 0%, transparent 65%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="text-center mb-14">
          <span className="badge-violet mb-4 inline-flex">Category</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            {categoryName} <span className="accent-text">Freelancers</span>
          </h1>
          <p className="text-gray-400">Explore top professionals in this category</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mb-4" />
            <p className="text-gray-400">Loading freelancers...</p>
          </div>
        ) : freelancers.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p>No freelancers found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {freelancers.map(f => (
              <div key={f._id || f.id} className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2))", color: "#c4b5fd" }}>
                      {(f.name || "?")[0]}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white leading-tight">{f.name}</h2>
                      <p className="text-xs mt-0.5" style={{ color: "#a78bfa" }}>{f.category || f.subcategory}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">
                    📍 {f.location?.city || f.city} {f.location?.pincode || f.pincode ? `— ${f.location?.pincode || f.pincode}` : ""}
                  </p>
                </div>
                <div className="mt-5 pt-5 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-xl font-extrabold text-white">₹{f.pricing?.amount || f.price}</p>
                  <Link to={`/freelancer/${f._id || f.id}`}>
                    <button className="btn-primary text-xs px-4 py-2">View Profile</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
