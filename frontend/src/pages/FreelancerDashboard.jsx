import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { FaWallet, FaStar } from "react-icons/fa";

function FreelancerDashboard() {
  const { user } = useUser(); // Clerk logged-in user
  const [freelancer, setFreelancer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch freelancer details from MongoDB using Clerk email
  useEffect(() => {
    const fetchFreelancer = async () => {
      if (!user) return;
      try {
        const email = user.emailAddresses[0].emailAddress;
        const res = await fetch(`http://localhost:5000/api/freelancers/by-email/${email}`);
        if (!res.ok) throw new Error("Failed to fetch freelancer");
        const data = await res.json();
        setFreelancer(data);
      } catch (err) {
        console.error("Error fetching freelancer:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancer();
  }, [user]);


const handleBookingAction = async (bookingId, action) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/bookings/${bookingId}/${action}`,
      { method: "PUT" }
    );
    const updated = await res.json();
    if (!res.ok) throw new Error(updated.message || "Action failed");

    // ✅ Update booking list locally
    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? updated : b))
    );

    // ✅ Refresh freelancer data (for completed projects)
    if (freelancer?._id) {
      const refreshRes = await fetch(
        `http://localhost:5000/api/freelancers/${freelancer._id}`
      );
      const freshData = await refreshRes.json();
      setFreelancer(freshData);
    }
  } catch (err) {
    console.error("Error updating booking:", err);
  }
};




  // ✅ Fetch all bookings for this freelancer
useEffect(() => {
  const fetchBookings = async () => {
    if (!freelancer?._id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/freelancer/${freelancer._id}`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  fetchBookings();
}, [freelancer, bookings.length]); // ✅ triggers refetch when new rating is added


  if (loading) return <div className="p-10 text-lg">Loading dashboard...</div>;
  if (!freelancer)
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        Freelancer profile not found. Please complete your profile setup.
      </div>
    );

  // ✅ Stats
  const completedProjects = freelancer.projects || [];
  const totalEarnings = completedProjects.reduce((a, c) => a + (c.amount || 0), 0);
  const averageRating =
    (
      completedProjects.reduce((a, c) => a + (c.rating || 0), 0) / completedProjects.length || 0
    ).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {freelancer.name}’s Dashboard
            </h1>
            <p className="text-gray-600">{freelancer.email}</p>
            <p className="text-gray-500 text-sm font-mono">MongoDB ID: {freelancer._id}</p>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-xl transition">
            <div className="text-indigo-600 mb-2">
              <FaWallet className="w-8 h-8" />
            </div>
            <div className="font-semibold">Total Earnings</div>
            <div className="text-indigo-600 text-2xl font-bold">₹{totalEarnings}</div>
            <div className="text-gray-500">From {completedProjects.length} projects</div>
          </div>

        <div className="bg-white shadow rounded-lg p-6 hover:shadow-xl transition">
  <div className="text-yellow-400 mb-2">
    <FaStar className="w-8 h-8" />
  </div>
  <div className="font-semibold">Average Rating</div>
  <div className="text-yellow-400 text-2xl font-bold">
    {freelancer.averageRating ? freelancer.averageRating : "0.0"}
  </div>
  <div className="text-gray-500">Based on client reviews</div>
</div>

        </div>

        {/* Completed Projects */}
       <section className="mb-12">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Completed Projects</h2>
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {freelancer.projects?.map((project) => (
      <div key={project._id} className="p-6 bg-white shadow rounded-xl">
        <h3 className="font-semibold text-lg">{project.projectTitle}</h3>
        <p>Client: {project.clientName}</p>
        <p>Amount: ₹{project.amount}</p>
      </div>
    ))}
  </div>
</section>


        {/* Bookings */}
       <section>
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Bookings</h2>
  {bookings.length === 0 ? (
    <p className="text-gray-500">No bookings yet.</p>
  ) : (
    <div className="grid gap-4">
      {bookings.map((b) => (
        <div key={b._id} className="p-4 bg-white shadow rounded-xl border">
          <p><strong>Project:</strong> {b.projectDetails}</p>
          <p><strong>Client:</strong> {b.clientName} ({b.clientEmail})</p>
          <p><strong>Advance Amount:</strong> ₹{b.advanceFee}</p>
          <p><strong>Status:</strong> 
            <span
              className={`ml-2 font-semibold ${
                b.status === "accepted"
                  ? "text-green-600"
                  : b.status === "ignored"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {b.status}
            </span>
          </p>

          {/* ✅ Action buttons */}
          {b.status === "pending" && (
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => handleBookingAction(b._id, "accept")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => handleBookingAction(b._id, "ignore")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Ignore
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</section>

      </div>
    </div>
  );
}

export default FreelancerDashboard;
