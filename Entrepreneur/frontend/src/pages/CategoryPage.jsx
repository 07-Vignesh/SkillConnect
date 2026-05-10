import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import freelancersData from "../datas/freelancers.json";

// shadcn
import { Card, CardContent } from "@/components/ui/card";

export default function CategoryPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const uniqueCategories = [
      ...new Set(
        freelancersData.map((freelancer) => freelancer.subcategory || freelancer.category)
      ),
    ].filter(Boolean);

    setCategories(uniqueCategories.map((name) => ({ name })));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6">

      {/* 🔥 Background */}
      <div className="grid-background"></div>

      {/* ================= HEADER ================= */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold gradient-title">
          Choose a Category
        </h1>

        <p className="text-muted-foreground mt-4">
          Explore services across technical and non-technical domains
        </p>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {categories.map((cat, index) => (
          <Card
            key={cat._id}
            onClick={() =>
              navigate(`/freelancers/${encodeURIComponent(cat.name)}`)
            }
            className="cursor-pointer hover:border-primary transition-all hover:scale-[1.03]"
          >
            <CardContent className="pt-6 text-center">

              {/* ICON */}
              <div className="text-4xl mb-4">
                {getCategoryIcon(cat.name)}
              </div>

              {/* NAME */}
              <h2 className="text-lg font-semibold">
                {cat.name}
              </h2>

              {/* SMALL DESC */}
              <p className="text-sm text-muted-foreground mt-2">
                Explore professionals in this category
              </p>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ================= ICON MAPPING ================= */
function getCategoryIcon(name) {
  const n = name.toLowerCase();

  if (n.includes("web")) return "🌐";
  if (n.includes("app")) return "📱";
  if (n.includes("design")) return "🎨";
  if (n.includes("marketing")) return "📈";
  if (n.includes("writing")) return "✍️";
  if (n.includes("video")) return "🎬";
  if (n.includes("data")) return "📊";
  if (n.includes("ai")) return "🤖";

  return "💼";
}