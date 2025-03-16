// FarmerAssistant.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './FarmerAssistant.css';

const FarmerAssistant = () => {
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
      const response = await axios.post('http://localhost:3001/api/farmer-assistant/chat', { 
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
      const welcomeMessage = {
        text: "Namaste! I'm your assistant for farmer schemes. How can I help you today? You can ask me about PM-KISAN, crop insurance, subsidies, or any other government schemes for farmers.",
        sender: 'bot'
      };
      setMessages([welcomeMessage]);
      speakText(welcomeMessage.text);
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
    <div className="farmer-assistant">
      {/* Chat toggle button */}
      <button 
        className={`chat-toggle ${isOpen ? 'open' : ''}`} 
        onClick={toggleChat}
      >
        {isOpen ? '×' : '💬'}
      </button>
      
      {/* Chat window */}
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <img 
            src="/images/female-assistant.png" 
            alt="Farmer Assistant" 
            className="assistant-avatar" 
          />
          <div>
            <h3>Kisan Mitra</h3>
            <p>Your Farming Schemes Assistant</p>
          </div>
          {isSpeaking && (
            <button className="stop-button" onClick={stopSpeaking}>
              🔇
            </button>
          )}
        </div>
        
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
          {isLoading && (
            <div className="loading-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}
        </div>
        
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about farmer schemes..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !inputMessage.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerAssistant;