import React, { useState } from "react";
import { Search, ArrowRight, Menu, X, Wheat, ShoppingCart, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const DigiKissanNavbar = ({ isLogin, setIsLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // ✅ सिर्फ navigate करो login page पर
  const handleSignIn = () => {
    navigate("/login");
  };

  // ✅ logout flow
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
    navigate("/login");
  };

  const handleFarmerSubmission = () => navigate("/farmer-submission-form");
  const handleBuyerPage = () => navigate("/buyer-section");

  return (
    <nav className="backdrop-blur-md bg-white/70 shadow-md w-full sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={assets.logo}
              alt="Government of India emblem"
              className="h-12 w-auto"
            />
            <div className="font-bold text-2xl">
              <span className="text-green-600">Digi</span>
              <span className="text-gray-900">Kisan</span>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="🔍 Search schemes..."
                className="w-full pl-5 pr-12 py-2.5 border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all text-gray-700"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLogin ? (
              <button
                className="bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-1 hover:bg-green-700 hover:shadow-md transition transform hover:-translate-y-0.5"
                onClick={handleSignIn}
              >
                Sign In <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="bg-red-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-1 hover:bg-red-700 hover:shadow-md transition transform hover:-translate-y-0.5"
                onClick={handleLogout}
              >
                Logout <LogOut size={16} />
              </button>
            )}
            <button
              className="bg-yellow-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-1 hover:bg-yellow-600 hover:shadow-md transition transform hover:-translate-y-0.5"
              onClick={handleFarmerSubmission}
            >
              Grain <Wheat size={16} />
            </button>
            <button
              className="bg-blue-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-1 hover:bg-blue-600 hover:shadow-md transition transform hover:-translate-y-0.5"
              onClick={handleBuyerPage}
            >
              Buyer <ShoppingCart size={16} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg animate-slideDown origin-top">
          <div className="flex flex-col space-y-3 px-4 py-4">
            {!isLogin ? (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-green-700 transition"
                onClick={handleSignIn}
              >
                Sign In <ArrowRight size={16} className="ml-1" />
              </button>
            ) : (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-red-700 transition"
                onClick={handleLogout}
              >
                Logout <LogOut size={16} className="ml-1" />
              </button>
            )}
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-yellow-600 transition"
              onClick={handleFarmerSubmission}
            >
              Grain <Wheat size={16} className="ml-1" />
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
              onClick={handleBuyerPage}
            >
              Buyer <ShoppingCart size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DigiKissanNavbar;
