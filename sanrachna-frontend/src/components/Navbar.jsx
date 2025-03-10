import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authData = JSON.parse(localStorage.getItem("auth"));
  const isAuthenticated = authData && new Date().getTime() < authData.expiryTime;

  const [showMiniSector, setShowMiniSector] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowMiniSector(false);
      } else {
        setShowMiniSector(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar Wrapper to Adjust for Content Below */}
      <div className="fixed top-0 w-full z-50">
        {/* Mini Sector */}
        {showMiniSector && (
          <div className="bg-gray-900 text-gray-300 text-sm flex justify-center items-center py-2">
            <span className="mx-4">📍 2A-2-G, Second Floor, Research & Innovation Park, IIT Delhi, 110016</span>
            <span className="mx-4">📞 +91 91191 26969</span>
            <span className="mx-4">📧 <a href="mailto:ceo@spplindia.org" className="underline">ceo@spplindia.org</a></span>
          </div>
        )}

        {/* Navbar */}
        <nav className="bg-gray-800 text-white shadow-lg h-16 flex items-center">
          <div className="max-w-6xl mx-auto flex justify-between items-center w-full px-4">
            
            {/* Left - Logo and Back Button */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
                <img src="/sppl-logo.png" alt="SPPL Logo" className="w-8 h-8 object-contain" />
              </div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <span className="text-xl">&larr;</span> {/* Unicode Left Arrow */}
                <span className="font-medium">Back</span>
              </button>
            </div>

            {/* Center - Links */}
            <div className="flex space-x-6">
              <Link to="/" className="text-lg font-semibold hover:text-blue-400 transition">
                Home
              </Link>
              <a href="https://spplindia.org/index.html" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:text-blue-400 transition">
                Main Site
              </a>
              <Link to="/projects" className="text-lg font-semibold hover:text-blue-400 transition">
                Projects
              </Link>
            </div>

            {/* Right - Authentication */}
            <div>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    localStorage.removeItem("auth");
                    navigate("/signin");
                  }}
                  className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500 transition"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/signin"
                  className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500 transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Spacer to Push Content Below Navbar */}
      <div className="pt-20"></div>
    </>
  );
};

export default Navbar;
