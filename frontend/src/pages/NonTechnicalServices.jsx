import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function NonTechnicalServices() {
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [locationDenied, setLocationDenied] = useState(false);

  // Fetch freelancers based on auto location (mock)
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async () => {
          try {
            // Mocked location: Chennai, 600001
            const res = await fetch(
              `http://localhost:5000/api/freelancers/search?city=Chennai&pincode=600001`
            );
            const data = await res.json();
            setCity("Chennai");
            setPincode("600001");
            setFiltered(data);
          } catch (error) {
            console.error(error);
          }
        },
        (error) => {
          console.warn("Location denied:", error.message);
          setLocationDenied(true);
        }
      );
    } else {
      setLocationDenied(true);
    }
  }, []);

  const handleSearch = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/freelancers/search?city=${city}&pincode=${pincode}`
      );
      const data = await res.json();
      setFiltered(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h2 className="text-center text-indigo-600 text-2xl font-extrabold tracking-wide mb-2">
        Your Task, Their Talent
      </h2>

      <h1 className="text-3xl font-bold text-center mb-8">
        Find Nearby Freelancers
      </h1>

      {locationDenied && (
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
          <label className="block mb-2 font-semibold">Select City</label>
          <input
            type="text"
            placeholder="Enter City (e.g., Chennai)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input input-bordered w-full mb-4"
          />

          <label className="block mb-2 font-semibold">Enter Pincode</label>
          <input
            type="text"
            placeholder="Enter Pincode (e.g., 600001)"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="input input-bordered w-full mb-4"
          />

          <button onClick={handleSearch} className="btn btn-primary w-full">
            Find Freelancers
          </button>
        </div>
      )}

      {/* Results */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filtered.length > 0 ? (
          filtered.map((f) => (
            <Link
              key={f.id}
              to={`/freelancer/${f.id}`}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
            >
              <h2 className="text-xl font-semibold">{f.name}</h2>
              <p className="text-gray-600">{f.category}</p>
              <p className="text-gray-500">
                {f.city} - {f.pincode}
              </p>
              <p className="text-lg font-bold mt-2">{f.price}</p>
            </Link>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            {locationDenied
              ? "No freelancers found. Try another city/pincode."
              : "Detecting your location..."}
          </p>
        )}
      </div>
    </div>
  );
}
