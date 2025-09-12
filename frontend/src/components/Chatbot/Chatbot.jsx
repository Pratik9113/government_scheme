import { useState } from 'react';
import axios from 'axios';

export default function Chatbot() {
    const [lang, setLang] = useState('hi');
    const [input, setInput] = useState('');
    const [chat, setChat] = useState([]);
    const [showChat, setShowChat] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { sender: 'You', text: input };
        setChat([...chat, userMsg]);

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND}/bot/chat`, {
                message: input,
                lang: lang,
            });

            const botMsg = { sender: 'Bot', text: res.data.response };
            setChat((prev) => [...prev, botMsg]);
        } catch (err) {
            console.error(err);
            setChat((prev) => [...prev, { sender: 'Bot', text: 'Error from server!' }]);
        }

        setInput('');
    };

    return (
        <>
            {/* Floating Button */}
            <button
                className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-700 z-50"
                onClick={() => setShowChat(!showChat)}
            >
                💬 Chatbot
            </button>

            {/* Chat Window */}
            {showChat && (
                <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white border border-gray-300 rounded-xl shadow-xl z-50 flex flex-col">
                    <div className="bg-green-600 text-white p-3 rounded-t-xl font-bold flex justify-between items-center">
                        <span>🌾 Farmer Assistant</span>
                        <button onClick={() => setShowChat(false)} className="text-white text-xl">&times;</button>
                    </div>

                    <div className="p-3 border-b flex items-center justify-between">
                        <label className="text-sm font-medium mr-2">Lang:</label>
                        <select
                            className="border p-1 rounded w-full"
                            value={lang}
                            onChange={(e) => setLang(e.target.value)}
                        >
                            <option value="hi">Hindi</option>
                            <option value="mr">Marathi</option>
                            <option value="en">English</option>
                        </select>
                    </div>

                    <div className="flex-grow p-3 overflow-y-auto h-64 bg-gray-50">
                        {chat.map((msg, index) => (
                            <div key={index} className={`mb-1 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
                                <span className={`font-semibold ${msg.sender === 'You' ? 'text-blue-600' : 'text-green-600'}`}>
                                    {msg.sender}:
                                </span>{' '}
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <div className="p-3 border-t flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-grow border p-2 rounded"
                            placeholder="Type your question..."
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
