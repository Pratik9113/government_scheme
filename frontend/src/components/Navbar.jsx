import React, { useState } from 'react';
import { Search, ArrowRight, Sun, Menu, X, Wheat, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DigiKissanNavbar = ({ setIsLogin }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleSignIn = (e) => {
        e.preventDefault();
        setIsLogin(true);
        navigate("/login");
    };
    const handleFarmerSubmission = () => navigate("/farmer-submission-form");
    const handleBuyerPage = () => navigate("/buyer-section");

    return (
        <nav className="bg-white shadow-md w-full">
            <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-3">
                        <img src='' alt="Government of India emblem" className="h-12 w-auto" />
                        <div className="font-bold text-2xl">
                            <span className="text-green-600">Digi</span>
                            <span className="text-gray-800">Kissan</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center flex-1 max-w-lg mx-4">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search schemes..."
                                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition" onClick={handleSignIn}>
                            Sign In <ArrowRight size={16} className="ml-1" />
                        </button>
                        <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-yellow-600 transition" onClick={handleFarmerSubmission}>
                            Grain <Wheat size={16} className="ml-1" />
                        </button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition" onClick={handleBuyerPage}>
                            Buyer <ShoppingCart size={16} className="ml-1" />
                        </button>
                        <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-medium">
                            Eng
                        </div>
                        <button className="bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center">
                            <Sun size={20} />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-gray-700 hover:text-gray-900 focus:outline-none">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 py-3">
                    <div className="flex flex-col space-y-3 px-4">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center" onClick={handleSignIn}>
                            Sign In <ArrowRight size={16} className="ml-1" />
                        </button>
                        <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center justify-center" onClick={handleFarmerSubmission}>
                            Grain <Wheat size={16} className="ml-1" />
                        </button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center" onClick={handleBuyerPage}>
                            Buyer <ShoppingCart size={16} className="ml-1" />
                        </button>
                        <div className="flex justify-between">
                            <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-medium">
                                Eng
                            </div>
                            <button className="bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center">
                                <Sun size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default DigiKissanNavbar;
