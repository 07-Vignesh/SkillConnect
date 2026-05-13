import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";
import skillconnectLogo from "../assets/logo3.png";

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useUser();
  const [role, setRole] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const updateRole = () => { 
      const r = localStorage.getItem("role"); 
      setRole(r || ""); 
    };
    const handleLogout = () => {
      // Clear all authentication data
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("freelancerId");
      setRole("");
    };
    if (!isSignedIn) { 
      handleLogout();
    } else {
      updateRole();
    }
    window.addEventListener("roleChanged", updateRole);
    window.addEventListener("logout", handleLogout);
    return () => {
      window.removeEventListener("roleChanged", updateRole);
      window.removeEventListener("logout", handleLogout);
    };
  }, [isSignedIn]);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/aboutus", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/pp", label: "Privacy" },
  ];

  const visibleLinks = navLinks.filter(l => l.to !== location.pathname);

  return (
    <header
      className="sticky top-0 z-50 navbar-glass transition-all duration-300"
      style={{ boxShadow: scrolled ? "0 4px 28px rgba(0,0,0,0.45)" : "none" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex justify-between justify-between">

        {/* LOGO */}
       <Link to="/" className="flex items-center h-full">
    <img
      src={skillconnectLogo}
      alt="SkillConnect"
      className="h-20 sm:h-24 w-auto object-contain mt-2"
    />
  </Link>
        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {visibleLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`transition-colors duration-200 ${location.pathname === l.to ? "text-violet-400" : "text-gray-400 hover:text-white"}`}
            >
              {l.label}
            </Link>
          ))}

          {isSignedIn && role === "freelancer" && (
            <Link to="/freelancer-dashboard" className="badge-violet hover:bg-violet-500/20 transition-colors cursor-pointer">
              Dashboard
            </Link>
          )}

          {!isSignedIn ? (
            <Link to="/login">
              <button className="btn-primary text-sm px-5 py-2">Sign In</button>
            </Link>
          ) : (
            <UserButton 
              afterSignOutUrl="/" 
              onSignOut={() => {
                localStorage.removeItem("role");
                localStorage.removeItem("token");
                localStorage.removeItem("freelancerId");
                setRole("");
                window.dispatchEvent(new Event("logout"));
              }} 
            />
          )}
        </nav>

        {/* MOBILE HAMBURGER */}
        <div className="md:hidden flex items-center gap-3">
          {isSignedIn && (
            <UserButton 
              afterSignOutUrl="/" 
              onSignOut={() => {
                localStorage.removeItem("role");
                localStorage.removeItem("token");
                localStorage.removeItem("freelancerId");
                setRole("");
                window.dispatchEvent(new Event("logout"));
              }} 
            />
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white transition-colors p-1">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden navbar-glass border-t border-white/5 px-5 py-5 space-y-1 animate-fade-in">
          {visibleLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium text-sm"
            >
              {l.label}
            </Link>
          ))}

          {isSignedIn && role === "freelancer" && (
            <Link to="/freelancer-dashboard" onClick={() => setIsOpen(false)}>
              <span className="badge-violet inline-flex mt-2">Dashboard</span>
            </Link>
          )}

          {!isSignedIn && (
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <button className="btn-primary w-full mt-3 justify-center">Sign In</button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
