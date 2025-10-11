
import React, { useState } from "react";

export default function FreelancerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("freelancerId", data.freelancer._id);
        window.location.href = "/dashboard"; // redirect
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Freelancer Login</h2>
        <input type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 border p-2 rounded" required />
        <input type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 border p-2 rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
