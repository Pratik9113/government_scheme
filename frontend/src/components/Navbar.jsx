import React, { useState } from 'react';
import { Menu, X, UserCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <nav className="bg-white shadow-lg">
            <div className="mx-auto px-4">
                <div className="flex justify-between h-18">
                    <div className="flex items-center">
                        <span className="text-xl font-bold flex items-center space-x-2">
                            <img src={assets.companyLogo} alt="Logo" className="w-8 h-8 object-contain" />
                            <span>Event</span>
                        </span>
                    </div>
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                            onClick={() => (navigate("/create"))}
                        >
                            <Calendar className="mr-2" size={20} />
                            Create Event23
                        </button>
                        <button className="flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
                            <UserCircle className="mr-2" size={20} />
                            Profile
                        </button>
                    </div>
                </div>
                {/* Mobile menu */}
                <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} pb-4`}>
                    <div className="space-y-2">
                        <button className="flex items-center w-full px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
                            <Calendar className="mr-2" size={20} />
                            Create Event
                        </button>
                        <button className="flex items-center w-full px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
                            <UserCircle className="mr-2" size={20} />
                            Profile
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;