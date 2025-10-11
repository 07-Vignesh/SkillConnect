import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Flproductcard() {
  const { categoryName } = useParams();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchFreelancers = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/freelancers/category/${encodeURIComponent(categoryName)}`
      );
      const data = await res.json();
      setFreelancers(Array.isArray(data) ? data : []); // ✅ ensure array
      setLoading(false);
    } catch (error) {
      console.error("Error fetching freelancers:", error);
      setFreelancers([]);
      setLoading(false);
    }
  };

  fetchFreelancers();
}, [categoryName]);


  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        {categoryName} Freelancers
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading freelancers...</p>
      ) : freelancers.length === 0 ? (
        <p className="text-center text-gray-500">No freelancers found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {freelancers.map((freelancer) => (
            <Link
              key={freelancer._id}
              to={`/freelancer/${freelancer._id}`}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-105 transition block"
            >
              <h2 className="text-xl font-semibold">{freelancer.name}</h2>
              <p className="text-gray-600">{freelancer.category}</p>
              <p className="text-gray-500">{freelancer.city} - {freelancer.pincode}</p>
              <p className="text-lg font-bold mt-2">₹{freelancer.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
