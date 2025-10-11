import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { UserButton, useUser } from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser(); // 👈 Clerk hook

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-indigo-600 tracking-wide">
          <Link to="/">FreelanceHub</Link>
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          {location.pathname !== "/" && (
            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition">
              Home
            </Link>
          )}
          <Link to="/aboutus" className="text-gray-700 hover:text-indigo-600 transition">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition">
            Contact
          </Link>
          <Link to="/pp" className="text-gray-700 hover:text-indigo-600 transition">
            Privacy Policy
          </Link>

          {/* Auth buttons */}
          {!isSignedIn ? (
            <Link
              to="/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow"
            >
              Login
            </Link>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-2xl text-gray-700 hover:text-indigo-600 focus:outline-none"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <nav className="flex flex-col items-end pr-6 space-y-4 py-4">
            {location.pathname !== "/" && (
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 transition"
                onClick={toggleMenu}
              >
                Home
              </Link>
            )}
            <Link to="/aboutus" className="text-gray-700 hover:text-indigo-600 transition" onClick={toggleMenu}>
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition" onClick={toggleMenu}>
              Contact
            </Link>
            <Link to="/pp" className="text-gray-700 hover:text-indigo-600 transition" onClick={toggleMenu}>
              Privacy Policy
            </Link>

            {/* Mobile auth buttons */}
            {!isSignedIn ? (
              <Link
                to="/login"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow"
                onClick={toggleMenu}
              >
                Login
              </Link>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
