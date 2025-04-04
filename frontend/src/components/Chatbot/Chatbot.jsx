import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);
    const speechSynthesisRef = useRef(null);

    // Function to call Groq API
    const callGroqAPI = async (message) => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:3003/api/farmer-assistant/chat', {
                message,
                // Include context about farming schemes
                context: 'Information about government schemes for farmers in India'
            });

            const botResponse = response.data.response || "Sorry, I couldn't get information at the moment.";
            return botResponse;
        } catch (error) {
            console.error('Error calling Groq API:', error);
            return "I'm having trouble connecting right now. Please try again later.";
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle sending messages
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message to chat
        const userMessage = { text: inputMessage, sender: 'user' };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        // Clear input
        setInputMessage('');

        // Get bot response
        const botResponseText = await callGroqAPI(inputMessage);

        // Add bot response to chat
        const botMessage = { text: botResponseText, sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]);

        // Read out the response
        speakText(botResponseText);
    };

    // Function to convert text to speech
    const speakText = (text) => {
        // Cancel any ongoing speech
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Select a female voice if available
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => voice.name.includes('female'));
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }

        // Set speech properties
        utterance.rate = 0.9;
        utterance.pitch = 1.1;

        // Speech events
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        // Store reference to current utterance
        speechSynthesisRef.current = utterance;

        // Speak
        speechSynthesis.speak(utterance);
    };

    // Stop speech when component unmounts
    useEffect(() => {
        return () => {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
        };
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load voices when component mounts
    useEffect(() => {
        // Some browsers need this to load voices
        speechSynthesis.onvoiceschanged = () => {
            speechSynthesis.getVoices();
        };
    }, []);

    // Toggle chat window
    const toggleChat = () => {
        setIsOpen(!isOpen);

        // Add welcome message if opening for first time and no messages
        if (!isOpen && messages.length === 0) {
            const languageOptions = {
                text: "Namaste! कृपया अपनी पसंदीदा भाषा चुनें:\n1. English\n2. हिंदी\n3. मराठी",
                sender: 'bot',
                options: ['English', 'हिंदी', 'मराठी']
            };
            setMessages([languageOptions]);
            speakText(languageOptions.text);
        }

    };

    // Stop speaking
    const stopSpeaking = () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat window */}
            <div className={`${isOpen ? 'flex' : 'hidden'} flex-col bg-white rounded-lg shadow-2xl transition-all duration-300 w-full md:w-96 h-96 md:h-[500px] mb-4 overflow-hidden border border-green-200`}>
                {/* Chat header */}
                <div className="flex items-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <div className="bg-white p-1 rounded-full mr-3">
                        <img
                            src="/images/female-assistant.png"
                            alt="Farmer Assistant"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg">Kisan Mitra</h3>
                        <p className="text-sm text-green-100">Your Farming Schemes Assistant</p>
                    </div>
                    {isSpeaking ? (
                        <button
                            className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                            onClick={stopSpeaking}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            className="p-2 hover:bg-green-700 rounded-full transition-colors"
                            onClick={toggleChat}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-3 max-w-3/4 ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
                        >
                            <div className={`p-3 rounded-lg ${msg.sender === 'user'
                                ? 'bg-green-600 text-white rounded-br-none'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                    {isLoading && (
                        <div className="flex space-x-2 justify-center items-center p-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    )}
                </div>

                {/* Chat input */}
                <form
                    className="p-3 bg-white border-t border-gray-200 flex"
                    onSubmit={handleSendMessage}
                >
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask about farmer schemes..."
                        disabled={isLoading}
                        className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputMessage.trim()}
                        className={`bg-green-600 text-white px-4 py-2 rounded-r-full font-medium ${isLoading || !inputMessage.trim()
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-green-700'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </form>
            </div>

            {/* Chat toggle button */}
            <button
                className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    } text-white`}
                onClick={toggleChat}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default ChatBot;