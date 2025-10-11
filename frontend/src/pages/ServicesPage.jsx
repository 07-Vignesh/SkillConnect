import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NonTechnicalServices() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  // Fetch freelancers from backend by city & pincode
  const fetchFreelancers = async (userCity, userPincode) => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/freelancers/location?city=${encodeURIComponent(
        userCity
      )}`;
      if (userPincode) url += `&pincode=${encodeURIComponent(userPincode)}`;

      const res = await fetch(url);
      const data = await res.json();
      setFreelancers(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching freelancers:", err);
      setLoading(false);
    }
  };

  // Convert lat/lng to city & pincode using Google Maps API
  const fetchCityAndPincode = async (lat, lng) => {
    const API_KEY = "YOUR_GOOGLE_API_KEY"; // Replace with your Google API key
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?lat=${lat}&lng=${lng}&key=${API_KEY}`
      );
      const data = await res.json();

      if (data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        const cityComp = addressComponents.find((c) =>
          c.types.includes("locality")
        );
        const pincodeComp = addressComponents.find((c) =>
          c.types.includes("postal_code")
        );

        return {
          city: cityComp ? cityComp.long_name : "",
          pincode: pincodeComp ? pincodeComp.long_name : "",
        };
      }
    } catch (err) {
      console.error("Error fetching city/pincode:", err);
    }

    return { city: "", pincode: "" };
  };

  // Detect location on page load
  useEffect(() => {
    const detectLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const location = await fetchCityAndPincode(lat, lng);

            if (location.city) {
              setCity(location.city);
              setPincode(location.pincode || "");
              fetchFreelancers(location.city, location.pincode);
            } else {
              setLocationDenied(true);
              setLoading(false);
            }
          },
          (err) => {
            console.warn("Location denied:", err.message);
            setLocationDenied(true);
            setLoading(false);
          }
        );
      } else {
        console.warn("Geolocation not supported");
        setLocationDenied(true);
        setLoading(false);
      }
    };

    detectLocation();
  }, []);

  // Manual search fallback
  const handleSearch = () => {
    if (city) fetchFreelancers(city, pincode);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h2 className="text-center text-indigo-600 text-2xl font-extrabold mb-2">
        Your Task, Their Talent
      </h2>
      <h1 className="text-3xl font-bold text-center mb-8">
        Find Nearby Freelancers
      </h1>

      {locationDenied && (
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
          <label className="block mb-2 font-semibold">City</label>
          <input
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input input-bordered w-full mb-4"
          />
          <label className="block mb-2 font-semibold">Pincode (Optional)</label>
          <input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="input input-bordered w-full mb-4"
          />
          <button onClick={handleSearch} className="btn btn-primary w-full">
            Find Freelancers
          </button>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading freelancers...</p>
        ) : freelancers.length > 0 ? (
          freelancers.map((f) => (
            <Link
              key={f._id}
              to={`/freelancer/${f._id}`}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
            >
              <h2 className="text-xl font-semibold">{f.name}</h2>
              <p className="text-gray-600">{f.category}</p>
              <p className="text-gray-500">
                {f.city} - {f.pincode || "N/A"}
              </p>
              <p className="text-lg font-bold mt-2">₹{f.price}</p>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No freelancers found nearby.
          </p>
        )}
      </div>
    </div>
  );
}
