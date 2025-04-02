import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const VendorChatBot = ({ userId, negotiation, closeChat }) => {
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

    const handlePayment = async () => {
        alert(`We Are redirect to the payment form , Purchase confirmed! ${vendor_quantity} units of ${negId} and   ${final_price_per_kg} for $${total_price}`);
        navigate(`/payment?quantity=${vendor_quantity}&budget=${total_price}&id=${negId}&priceperkg=${final_price_per_kg}`);
        onClose();
    }
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const newMessage = { sender: 'You', text: inputMessage };
        setMessages(prev => [...prev, newMessage]);
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_FLASK_BACKEND}/negotiate`, {
                negotiationId: negotiation._id,
                userId: userId,
                grainType: negotiation.grainType,
                pricePerKg: negotiation.pricePerKg,
                quantity: negotiation.availableQuantity,
                cropType: negotiation.cropType,
                description: negotiation.description,
                message: inputMessage,
            });
            console.log("respose", response);

            // Update the message and show the button if required
            setMessages(prev => [...prev, { sender: 'Bot', text: response.data.reply }]);
            setShowDealButton(response.data.showDealButton);
            set_final_price_per_kg(response.data.pricePerKg);
            set_vendor_quantity(response.data.quantity);
            set_total_price(response.data.totalPrice);
            setNegId(response.data.negotiationId);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { sender: 'Bot', text: "Error: Unable to get a response." }]);
        } finally {
            setLoading(false);
        }

        setInputMessage('');
    };

    return (
        <div className="fixed bottom-5 right-5 w-80 bg-white shadow-lg rounded-lg p-4 border">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h2 className="text-lg font-semibold">Negotiation Chat</h2>
                <button onClick={closeChat} className="text-red-500 text-lg">&times;</button>
            </div>
            <div className="h-60 overflow-y-auto mb-3 border p-2 rounded">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-2 my-1 rounded-lg ${msg.sender === 'You' ? 'bg-blue-100 text-right' : 'bg-gray-200'}`}>
                        <strong>{msg.sender}:</strong> {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            <div className="flex">
                <input
                    type="text"
                    className="flex-1 border p-2 rounded-l"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={loading}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-3 py-2 rounded-r disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "..." : "Send"}
                </button>
            </div>

            {/* Show the "Deal done" button if the flag is true */}
            {showDealButton && (
                <div className="mt-4 flex justify-center">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={handlePayment}
                    >
                        Complete Purchase
                    </button>
                </div>
            )}
        </div>
    );
};

export default VendorChatBot;
