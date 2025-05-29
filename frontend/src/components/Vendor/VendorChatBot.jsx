import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const VendorChatBot = ({ userId, negotiation, closeChat, defaultMessage }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDealButton, setShowDealButton] = useState(false);
    const [final_price_per_kg, set_final_price_per_kg] = useState(0);
    const [vendor_quantity, set_vendor_quantity] = useState(0);
    const [total_price, set_total_price] = useState(0);
    const [negId, setNegId] = useState('');
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const handlePayment = () => {
        alert(`Redirecting to payment. Confirmed: ${vendor_quantity} units at ₹${final_price_per_kg}/kg = ₹${total_price}`);
        navigate(`/payment?quantity=${vendor_quantity}&budget=${total_price}&id=${negId}&priceperkg=${final_price_per_kg}`);
        closeChat();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Show defaultMessage when component mounts
    useEffect(() => {
        if (defaultMessage) {
            setMessages([{ sender: 'Bot', text: defaultMessage }]);
        }
    }, [defaultMessage]);

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const newMessage = { sender: 'You', text: inputMessage };
        setMessages(prev => [...prev, newMessage]);
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_FLASK_BACKEND}/negotiate`, {
                negotiationId: negotiation._id,
                userId,
                grainType: negotiation.grainType,
                pricePerKg: negotiation.pricePerKg,
                quantity: negotiation.availableQuantity,
                cropType: negotiation.cropType,
                description: negotiation.description,
                message: inputMessage,
            });

            setMessages(prev => [...prev, { sender: 'Bot', text: response.data.reply }]);
            setShowDealButton(response.data.showDealButton);
            set_final_price_per_kg(response.data.pricePerKg);
            set_vendor_quantity(response.data.quantity);
            set_total_price(response.data.totalPrice);
            setNegId(response.data.negotiationId);
        } catch (error) {
            console.error('Message send failed:', error);
            setMessages(prev => [...prev, { sender: 'Bot', text: "⚠️ Error: Couldn't respond. Please try again." }]);
        } finally {
            setLoading(false);
            setInputMessage('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md max-h-[90vh] mx-4 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">

                {/* Header */}
                <div className="bg-green-600 text-white px-5 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">💬 Vendor Negotiation Chat</h2>
                    <button onClick={closeChat} className="text-2xl font-bold hover:text-red-300">&times;</button>
                </div>

                {/* Chat Body */}
                <div className="flex-grow overflow-y-auto px-5 py-4 space-y-4 bg-gray-50">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed shadow ${msg.sender === 'You'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                                }`}>
                                <strong className="block text-xs mb-1">{msg.sender}</strong>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef}></div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-white flex gap-3">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={loading}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "..." : "Send"}
                    </button>
                </div>

                {/* Deal Done Button */}
                {showDealButton && (
                    <div className="p-4 border-t bg-white flex justify-center">
                        <button
                            className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600"
                            onClick={handlePayment}
                        >
                            ✅ Confirm & Pay
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

};

export default VendorChatBot;
