import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: 1, name: "Web Development", icon: "💻" },
  { id: 2, name: "Graphic Design", icon: "🎨" },
  { id: 3, name: "Content Writing", icon: "✍️" },
  { id: 4, name: "Digital Marketing", icon: "📢" },
  { id: 5, name: "Non-Technical Services", icon: "🛠️" },
];

export default function CategoryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-12">
        Choose a Category
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() =>
              navigate(`/freelancers/${encodeURIComponent(cat.name)}`)
            }
            className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:scale-105 hover:shadow-xl transition"
          >
            <div className="text-6xl mb-4">{cat.icon}</div>
            <h2 className="text-xl font-semibold">{cat.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
