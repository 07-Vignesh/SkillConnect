import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function FreelancerDetails() {
  const { id } = useParams(); // freelancer MongoDB ID
  const { user } = useUser(); // logged-in user from Clerk

  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  // ✅ Fetch freelancer details
  useEffect(() => {
    if (!id) return;

    const fetchFreelancer = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/freelancers/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Freelancer not found");
        setFreelancer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancer();
  }, [id]);

  // ✅ Handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please login to book a freelancer.");
      return;
    }

    const clientName = user.fullName || e.target.name.value.trim();
    const clientEmail = user.emailAddresses?.[0]?.emailAddress;
    const projectDetails = e.target.details.value.trim();
    const advanceFee = Number(e.target.advanceFee.value) || 0;

    if (!projectDetails || !advanceFee) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerId: id,
          clientId: user.id, // Clerk user ID
          clientName,
          clientEmail,
          projectDetails,
          advanceFee,
          status: "pending",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");
      setBooking(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Cancel booking
  const cancelBooking = async () => {
    if (!booking?._id) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${booking._id}/cancel`,
        { method: "PUT" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cancel failed");
      setBooking(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading freelancer...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!freelancer) return <p>Freelancer not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold">{freelancer.name}</h1>
        <p className="text-indigo-600">{freelancer.category}</p>
        <p className="text-xl font-semibold mt-4">Starting at ₹{freelancer.price}</p>
        <p className="mt-2 text-gray-600">
          {freelancer.city} - {freelancer.pincode}
        </p>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {!booking ? (
          <form onSubmit={handleBooking} className="mt-8 grid gap-4">
            {!user && (
              <>
                <input
                  name="name"
                  placeholder="Your Name"
                  required
                  className="border p-2 rounded"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  required
                  className="border p-2 rounded"
                />
              </>
            )}
            <textarea
              name="details"
              placeholder="Project Details"
              required
              className="border p-2 rounded"
            ></textarea>
            <select name="advanceFee" required className="border p-2 rounded">
              <option value="">Select Advance Fee</option>
              <option value="19">₹19</option>
              <option value="29">₹29</option>
              <option value="49">₹49</option>
            </select>
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Confirm Booking
            </button>
          </form>
        ) : (
          <div className="mt-6 p-6 bg-green-100 rounded-lg">
            <h2 className="text-xl font-bold text-green-700">🎉 Booking Confirmed!</h2>
            <p className="mt-2">
              You’ve successfully booked <strong>{freelancer.name}</strong>.
            </p>
            <p className="mt-2 text-gray-700">
              Advance Paid: ₹{booking.advanceFee}
            </p>
            <button
              onClick={cancelBooking}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
