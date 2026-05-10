import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";
import skillconnectLogo from "../assets/logo2.png";
import { Button } from "@/components/ui/button";

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();
  const [role, setRole] = useState("");

useEffect(() => {
  const updateRole = () => {
    const userRole = localStorage.getItem("role");
    setRole(userRole || "");
  };

  if (!isSignedIn) {
    setRole("");
    localStorage.removeItem("role");
  } else {
    updateRole();
  }

  window.addEventListener("roleChanged", updateRole);

  return () => {
    window.removeEventListener("roleChanged", updateRole);
  };
}, [isSignedIn]);
  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
      
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex justify-between items-center ">

        {/* 🔥 LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src={skillconnectLogo}
            alt="SkillConnect"
            className="h-20 md:h-20 w-auto scale-150 object-contain"
          />
        </Link>

        {/* ================= DESKTOP ================= */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">

          {location.pathname !== "/" && (
            <Link className="hover:text-white transition" to="/">
              Home
            </Link>
          )}

          <Link className="hover:text-white transition" to="/aboutus">
            About
          </Link>

          <Link className="hover:text-white transition" to="/contact">
            Contact
          </Link>

          <Link className="hover:text-white transition" to="/pp">
            Privacy
          </Link>
          {isSignedIn && role === "freelancer" && (
  <Link to="/freelancer-dashboard">
    <Button className="bg-white text-black hover:bg-gray-200">
      Dashboard
    </Button>
  </Link>
)}

          {/* AUTH */}
          {!isSignedIn ? (
            <Link to="/login">
              <Button className="bg-white text-black hover:bg-gray-200">
                Sign In
              </Button>
            </Link>
          ) : (
            <UserButton
              afterSignOutUrl="/"
              onSignOut={() => {
                localStorage.removeItem("role");
                setRole(""); // 🔥 FORCE UI UPDATE
              }}
            />
          )}
        </nav>

        {/* ================= MOBILE ================= */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 px-6 py-6 space-y-4 text-gray-300">

          {location.pathname !== "/" && (
            <Link onClick={() => setIsOpen(false)} to="/" className="block hover:text-white">
              Home
            </Link>
          )}

          <Link onClick={() => setIsOpen(false)} to="/aboutus" className="block hover:text-white">
            About
          </Link>

          <Link onClick={() => setIsOpen(false)} to="/contact" className="block hover:text-white">
            Contact
          </Link>

          <Link onClick={() => setIsOpen(false)} to="/pp" className="block hover:text-white">
            Privacy
          </Link>

          {isSignedIn && role === "freelancer" && (
  <Link to="/freelancer-dashboard">
    <Button className="bg-white text-black hover:bg-gray-200">
      Dashboard
    </Button>
  </Link>
)}


          {!isSignedIn ? (
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-white text-black">
                Sign In
              </Button>
            </Link>
          ) : (
            <UserButton
              afterSignOutUrl="/"
              onSignOut={() => {
                localStorage.removeItem("role");
                setRole(""); // 🔥 FORCE UI UPDATE
              }}
            />
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;