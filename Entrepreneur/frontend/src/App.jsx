import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "./pages/HomePage.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import Contact from "./pages/Contact.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import Flproductcard from "./components/Flproductcard.jsx";
import FreelancerDetails from "./pages/FreelancerDetails.jsx";
import NonTechnicalServices from "./pages/NonTechnicalServices.jsx";
import FreelancerSignup from "./pages/FreelancerSignup.jsx";
import ProfileSetup from "./pages/ProfileSetup.jsx";
import FreelancerDashboard from "./pages/FreelancerDashboard.jsx";
import FreelancerProfile from "./pages/FreelancerProfile.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import FreelancerLogin from "./pages/FreelancerLogin.jsx";
import LoginPage from "./pages/Login.jsx";
import UserBookings from "./pages/UserBookings.jsx";
import { SignIn, SignUp, UserButton } from "@clerk/clerk-react";
import Navbar from "./components/Navbar.jsx";
import ChatBot from "./pages/ChatBot.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // ✅ unique session per browser tab
  const sessionId = useState(() => `session-${Date.now()}`)[0];

  const sendMessage = async (message) => {
    const response = await fetch("https://skillconnect-ai.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "Unitoids@2026",
        "x-session-id": sessionId,  // ✅ for memory
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    return data;
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLoginToggle={() => setIsLoggedIn(!isLoggedIn)} />
      <Toaster />
      <ChatBot sendMessage={sendMessage} />
      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pp" element={<PrivacyPolicy />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/non-technical" element={<NonTechnicalServices />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/freelancer-login" element={<FreelancerLogin />} />
        <Route path="/freelancer-signup" element={<FreelancerSignup />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
        <Route path="/freelancer-profile" element={<FreelancerProfile />} />
        <Route path="/UserBooking" element={<UserBookings />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/freelancers/:categoryName" element={<Flproductcard />} />
        <Route path="/freelancer/:id" element={<FreelancerDetails />} />
        <Route path="/freelancer/:id/dashboard" element={<FreelancerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;