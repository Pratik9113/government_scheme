import React, { useState, useEffect } from "react";
import { Search, ChevronDown, ArrowLeft, Menu, X } from "lucide-react";
import axios from "axios";

const SchemesDashboard = ({ language }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [schemes, setSchemes] = useState([]);
    const [filteredSchemes, setFilteredSchemes] = useState([]);
    const [filters, setFilters] = useState({
        state: "",
        gender: "",
        age: "",
        caste: "",
        ministry: "",
        benefitType: ""
    });

    useEffect(() => {
        const getSchemeData = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND}/scheme/getScheme?lang=${language}`;
                const response = await axios.get(url);
                setSchemes(response.data.data || []);
                setFilteredSchemes(response.data.data || []);
            } catch (error) {
                console.error("Error fetching scheme data:", error);
                alert("Failed to load schemes. Please try again.");
            }
        };

        if (language) {
            getSchemeData();
        }
    }, [language]);

    useEffect(() => {
        let tempSchemes = schemes.filter((scheme) => {
            return (
                (filters.state ? scheme.state === filters.state : true)
            );
        });
        setFilteredSchemes(tempSchemes);
    }, [filters, searchQuery, schemes]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md p-4">
                <h2 className="text-lg font-bold mb-4">Filters</h2>
                <select name="state" onChange={handleFilterChange} className="w-full p-2 mb-3 border rounded">
                    <option value="">Select State</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Bihar">Bihar</option>
                </select>
               
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4">
                <h2 className="text-xl font-bold mb-4">Total {filteredSchemes.length} Schemes Available</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSchemes.map((scheme, index) => (
                        <div key={index} className="bg-white p-4 shadow rounded-lg">
                            <h3 className="text-lg font-bold text-blue-600"> <a href={scheme.link}>{scheme.title} </a></h3>
                            <p className="text-sm text-gray-600">{scheme.description}</p>
                            <p className="text-sm mt-2">State: {scheme.state}</p>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SchemesDashboard;
