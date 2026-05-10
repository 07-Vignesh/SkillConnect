import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

// shadcn
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function FreelancerDashboard() {
  const { user } = useUser();
  const [freelancer, setFreelancer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH FREELANCER =================
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
        // Error silently
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancer();
  }, [user]);

  // ================= FETCH BOOKINGS =================
  useEffect(() => {
    const fetchBookings = async () => {
      if (!freelancer?._id) return;

      const res = await fetch(
        `http://localhost:5000/api/bookings/freelancer/${freelancer._id}`
      );
      const data = await res.json();
      setBookings(data);
    };

    fetchBookings();
  }, [freelancer]);

  // ================= ACTION =================
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
    // Error silently
  }
};


  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );

  if (!freelancer)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Profile not found
      </div>
    );

  // ================= STATS =================
  const projects = freelancer.projects || [];
  const earnings = projects.reduce((a, c) => a + (c.amount || 0), 0);
  const rating =
    (
      projects.reduce((a, c) => a + (c.rating || 0), 0) /
        projects.length || 0
    ).toFixed(1);

  return (
    <div className="min-h-screen relative overflow-hidden text-foreground px-6 py-10">

      {/* 🔥 BACKGROUND */}
      <div className="grid-background"></div>
      <div className="absolute inset-0 bg-black/90 z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome, {freelancer.name} 👋
          </h1>
          <p className="text-gray-400">{freelancer.email}</p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid md:grid-cols-2 gap-6">

          <Card className="bg-white/5 border border-white/10 backdrop-blur">
            <CardContent className="pt-6">
              <h3 className="text-gray-400 text-sm">Total Earnings</h3>
              <p className="text-3xl font-bold text-white mt-2">
                ₹{earnings}
              </p>
              <p className="text-sm text-gray-500">
                {projects.length} projects completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-white/10 backdrop-blur">
            <CardContent className="pt-6">
              <h3 className="text-gray-400 text-sm">Average Rating</h3>
              <p className="text-3xl font-bold text-white mt-2">
                ⭐ {rating}
              </p>
              <p className="text-sm text-gray-500">
                Based on reviews
              </p>
            </CardContent>
          </Card>

        </div>

        {/* ================= PROJECTS ================= */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Completed Projects
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Card
                key={p._id}
                className="bg-white/5 border border-white/10 backdrop-blur"
              >
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-white">
                    {p.projectTitle}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Client: {p.clientName}
                  </p>
                  <p className="mt-2 font-bold text-white">
                    ₹{p.amount}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ================= BOOKINGS ================= */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Incoming Bookings
          </h2>

          {bookings.length === 0 ? (
            <p className="text-gray-400">No bookings yet</p>
          ) : (
            <div className="grid gap-4">

              {bookings.map((b) => (
                <Card
                  key={b._id}
                  className="bg-white/5 border border-white/10 backdrop-blur"
                >
                  <CardContent className="pt-6 space-y-2">

                    <p className="font-semibold text-white">
                      {b.projectDetails}
                    </p>

                    <p className="text-sm text-gray-400">
                      {b.clientName} • {b.clientEmail}
                    </p>

                    <p className="text-sm text-gray-300">
                      Advance: ₹{b.advanceFee}
                    </p>

                    <p
                      className={`text-sm font-semibold ${
                        b.status === "accepted"
                          ? "text-green-400"
                          : b.status === "ignored"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {b.status}
                    </p>

                    {b.status === "pending" && (
                      <div className="flex gap-3 pt-2">

                        <Button
                          onClick={() =>
                            handleBookingAction(b._id, "accept")
                          }
                        >
                          Accept
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleBookingAction(b._id, "ignore")
                          }
                        >
                          Ignore
                        </Button>

                      </div>
                    )}

                  </CardContent>
                </Card>
              ))}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default FreelancerDashboard;