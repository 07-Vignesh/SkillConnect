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
import ErrorPage from "./pages/ErrorPage.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const sessionId = useState(() => {
    const saved = localStorage.getItem("skillconnect_chat_session_id");
    if (saved) return saved;
    const nextId = `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem("skillconnect_chat_session_id", nextId);
    return nextId;
  })[0];

  const sendMessage = async (message) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
    const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      return { general_answer: "Gemini API key is missing. Add VITE_GEMINI_API_KEY to the frontend .env file." };
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text:
                    "You are the SkillConnect AI assistant for the freelancer marketplace app built by Vikneshwaran. Developer/owner: Vikneshwaran. Portfolio: vikneshwaran.dev. This app is a platform for hiring freelancers and connecting clients with technical and non-technical service providers in India. Help users with hiring, freelancer discovery, categories, pricing, bookings, support, login, signup, and profile tasks. Keep answers concise, helpful, and professional. When asked about the app creator or developer, mention that this app was developed by Vikneshwaran and the portfolio is vikneshwaran.dev."
                }
              ]
            },
            contents: [
              {
                role: "user",
                parts: [{ text: message }],
              }
            ]
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Gemini API error (${response.status})`);
      }

      const data = await response.json();
      const answer =
        data?.candidates?.[0]?.content?.parts
          ?.map((part) => part.text)
          .join("")
          .trim() || "No response received";

      return { general_answer: answer };
    } catch (error) {
      console.error("Gemini AI request failed:", error);
      return { general_answer: "Sorry, the AI service is currently unavailable. Please try again." };
    }
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
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;