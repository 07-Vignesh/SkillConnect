import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

// Pages
import HomePage from "./pages/HomePage.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import Contact from "./pages/Contact.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import Flproductcard from "./components/Flproductcard.jsx";
import FreelancerDetails from "./pages/FreelancerDetails.jsx";
import NonTechnicalServices from "./pages/NonTechnicalServices.jsx";
import SecureSignup from "./pages/SecureSignup.jsx";
import FreelancerSignup from "./pages/FreelancerSignup.jsx";
import ProfileSetup from "./pages/ProfileSetup.jsx";
import FreelancerDashboard from "./pages/FreelancerDashboard.jsx";
import FreelancerProfile from "./pages/FreelancerProfile.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import FreelancerLogin from "./pages/FreelancerLogin.jsx";
import LoginPage from "./pages/Login.jsx";
import UserBookings from "./pages/UserBookings.jsx";
// Clerk
import { SignIn, SignUp, UserButton } from "@clerk/clerk-react";

// Components
import Navbar from "./components/Navbar.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      {/* Navbar */}
      <Navbar
        isLoggedIn={isLoggedIn}
        onLoginToggle={() => setIsLoggedIn(!isLoggedIn)}
      />

      {/* All Routes */}
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pp" element={<PrivacyPolicy />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/non-technical" element={<NonTechnicalServices />} />

        {/* Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/freelancer-login" element={<FreelancerLogin />} />
        <Route path="/signup" element={<SecureSignup />} />
        <Route path="/freelancer-signup" element={<FreelancerSignup />} />

        {/* Freelancer Pages */}
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
        <Route path="/freelancer-profile" element={<FreelancerProfile />} />
        <Route path="/UserBooking" element={<UserBookings/>} />


        {/* Bookings */}
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Freelancer Listing & Details */}
        <Route path="/freelancers/:categoryName" element={<Flproductcard />} />
<Route path="/freelancer/:id" element={<FreelancerDetails />} />
  <Route path="/freelancer/:id/dashboard" element={<FreelancerDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
