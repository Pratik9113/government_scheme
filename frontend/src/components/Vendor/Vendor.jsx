import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import VendorChatBot from './VendorChatBot';

const Vendor = () => {
    const [negotiations, setNegotiations] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [selectedNegotiation, setSelectedNegotiation] = useState({});
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.userId);
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, []);

    const getNegotiation = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND}/vendor/get-all-negotition`, {
                withCredentials: true,
            });
            if (response.data) {
                setNegotiations(response.data.data);
            } else {
                alert("Error in getting data");
            }
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        getNegotiation();
    }, []);

    const openChat = (negotiation) => {
        const { grainType, cropType, pricePerKg, availableQuantity, description } = negotiation;

        const defaultMessage = `🌾 *Negotiation Details*:
- Grain Type: ${grainType}
- Crop Type: ${cropType}
- Price: ₹${pricePerKg}/kg
- Quantity: ${availableQuantity} kg
- Description: ${description || "N/A"}`;

        setSelectedNegotiation({ ...negotiation, defaultMessage });
        setShowChat(true);
    };

    const closeChat = () => {
        setShowChat(false);
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Market Price Listing</h1>

            {negotiations.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {negotiations.map((negotiation) => (
                        <div
                            key={negotiation.id}
                            className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-semibold text-lg text-gray-800">{negotiation.grainType}</span>
                                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                    {negotiation.cropType}
                                </span>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Price:</span>
                                    <span className="font-medium text-green-700">₹{negotiation.pricePerKg}/kg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Available:</span>
                                    <span className="font-medium">{negotiation.availableQuantity} kg</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 p-2 border-l-4 border-gray-200 bg-gray-50 rounded-r-lg">
                                {negotiation.description || "No description available"}
                            </p>

                            <button
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                                onClick={() => openChat(negotiation)}
                            >
                                Start Negotiation
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-auto border border-gray-100">
                    <p className="text-gray-500">No negotiations available at the moment</p>
                </div>
            )}

            {showChat && (
                <VendorChatBot
                    userId={userId}
                    negotiation={selectedNegotiation}
                    closeChat={closeChat}
                    defaultMessage={selectedNegotiation.defaultMessage}
                />
            )}
        </div>
    );
};

export default Vendor;
