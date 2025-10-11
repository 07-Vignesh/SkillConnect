import React, { useState, useEffect } from "react";

export default function MyBookings({ userEmail }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch(`http://localhost:5000/api/freelancers/user-bookings/${userEmail}`);
      const data = await res.json();
      setBookings(data);
    };
    fetchBookings();
  }, [userEmail]);

  return (
    <div>
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map(b => (
            <li key={b._id}>
              {b.freelancer.name} - {b.projectDetails} - ₹{b.advanceFee} - {b.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
