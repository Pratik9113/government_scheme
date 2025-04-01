import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import VendorChatBot from './VendorChatBot';

const Vendor = () => {
    const [negotiations, setNegotiations] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [selectedNegotiation, setSelectedNegotiation] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("Token from localStorage:", token);

        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Correct usage
                console.log("Decoded Token:", decodedToken);
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
        setSelectedNegotiation(negotiation);
        setShowChat(true);
    };

    const closeChat = () => {
        setShowChat(false);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Negotiations</h1>
            <div className="overflow-x-auto w-full max-w-5xl">
                <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-blue-600 text-white text-center">
                            <th className="py-3 px-6">#</th>
                            <th className="py-3 px-6">Grain Type</th>
                            <th className="py-3 px-6">Price/Kg</th>
                            <th className="py-3 px-6">Quantity</th>
                            <th className="py-3 px-6">Crop Type</th>
                            <th className="py-3 px-6">Description</th>
                            <th className="py-3 px-6">Negotiate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {negotiations.length > 0 ? (
                            negotiations.map((negotiation, index) => (
                                <tr key={negotiation.id} className="border-b text-center hover:bg-gray-200 transition">
                                    <td className="py-3 px-6">{index + 1}</td>
                                    <td className="py-3 px-6">{negotiation.grainType}</td>
                                    <td className="py-3 px-6">₹{negotiation.pricePerKg}</td>
                                    <td className="py-3 px-6">{negotiation.availableQuantity} kg</td>
                                    <td className="py-3 px-6">{negotiation.cropType}</td>
                                    <td className="py-3 px-6">{negotiation.description}</td>
                                    <td className="py-3 px-6">
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded"
                                            onClick={() => openChat(negotiation)}
                                        >
                                            Negotiate
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-gray-500">No negotiations available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showChat && <VendorChatBot userId={userId} negotiation={selectedNegotiation} closeChat={closeChat} />}
        </div>
    );
};

export default Vendor;
