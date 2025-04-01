import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ArrowLeft, Menu, X } from 'lucide-react';
import axios from "axios";
const SchemesDashboard = ({ language }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const filters = [
        'State', 'Gender', 'Age', 'Caste', 'Ministry Name', 'Level',
        'Residence', 'Minority', 'Differently Abled', 'Benefit Type',
        'DBT Scheme', 'Disability Percentage'
    ];

    const [schemes, setSchemes] = useState([]);
    useEffect(() => {
        const getSchemeData = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND}/scheme/getScheme?lang=${language}searchQuery=${searchQuery}`;
                console.log(url);
                console.log("Fetching data from:", url);
                const response = await axios.get(url);
                console.log("API Response:", response.data);
                setSchemes(response.data.data || []);
            } catch (error) {
                console.error("Error fetching scheme data:", error);
                alert("Failed to load schemes. Please try again.");
            }
        };

        if (language) {
            getSchemeData();
        }
    }, [language]);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
                <button onClick={toggleSidebar} className="p-2">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex items-center">
                    <span className="font-medium text-gray-700">my</span>
                    <span className="font-bold text-gray-900">Scheme</span>
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Left Sidebar */}
            <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        overflow-y-auto h-full
      `}>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            <span className="text-gray-700 font-medium">All Schemes</span>
                        </div>
                        <button onClick={toggleSidebar} className="lg:hidden">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Filters</h2>
                        <button className="text-blue-500 mb-4">Reset</button>
                    </div>

                    {filters.map((filter) => (
                        <div key={filter} className="py-2 border-t">
                            <button className="w-full flex justify-between items-center text-gray-700">
                                {filter}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 lg:p-6">
                {/* Desktop Header */}
                <div className="hidden lg:flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <span className="font-medium text-gray-700">my</span>
                        <span className="font-bold text-gray-900">Scheme</span>
                    </div>

                    <div className="relative flex-1 mx-8">
                        <input
                            type="text"
                            placeholder="Insert Prompt"
                            className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="lg:hidden relative mb-4">
                    <input
                        type="text"
                        placeholder="Search Schemes"
                        className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                    <h2 className="text-lg font-semibold">Total {schemes.length} Schemes Available</h2>
                    <select className="w-full sm:w-auto px-4 py-2 border rounded-md bg-white">
                        <option>Sort: Scheme Name (A→Z)</option>
                        {schemes.map((scheme, index) => {
                            return <option key={index}>{scheme.title}</option>
                        })}
                    </select>
                </div>

                {/* Schemes List */}
                <div className="space-y-4">
                    {schemes.map((scheme, index) => (
                        <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-sm text-gray-600 mb-2">{scheme.state}</div>
                            <h3 className="text-blue-600 font-medium mb-3 hover:underline cursor-pointer">
                                <a href={scheme.link}>{scheme.title} </a>
                            </h3>
                            <p className="text-gray-600 mb-4 text-sm lg:text-base">{scheme.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {scheme.tags.map((tag, tagIndex) => (
                                    <span
                                        key={tagIndex}
                                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SchemesDashboard;