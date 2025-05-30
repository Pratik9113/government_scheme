import React from 'react';
import { MessageSquare, BarChart2, TrendingUp, Hand } from 'lucide-react';

const AgriTechSteps = () => {
    return (
        <div className="w-full bg-white py-16 px-4">
            {/* Dots pattern decoration */}
            <div className="absolute left-0 top-1/4 grid grid-cols-7 gap-2">
                {Array(35).fill(0).map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-green-300 rounded-full"></div>
                ))}
            </div>

            {/* Heading Section */}
            <div className="text-center mb-16 max-w-4xl mx-auto">
                <p className="text-gray-500 text-lg mb-2">How it works</p>
                <h2 className="text-4xl md:text-5xl font-bold">
                    Easy steps to use our
                    <br />
                    DigiKisan Platform
                </h2>
            </div>

            {/* Steps Section */}
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 md:gap-0 max-w-6xl mx-auto">
                {/* Step 1 */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center flex-1 relative">
                    <div className="flex justify-center mb-6">
                        <MessageSquare size={48} className="text-green-500" />
                    </div>
                    <h3 className="text-xl text-green-600 font-semibold mb-4">
                        Multilingual Chatbot
                    </h3>
                    <p className="text-gray-700">
                        Start by connecting with our <strong>AI assistant</strong> in your local language!
                    </p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center px-4">
                    <div className="w-16 h-16 text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center flex-1 relative">
                    <div className="flex justify-center mb-6">
                        <Hand size={48} className="text-green-500" />
                    </div>
                    <h3 className="text-xl text-green-600 font-semibold mb-4">
                        Market Negotiation
                    </h3>
                    <p className="text-gray-700">
                        Our platform will <strong>find the best prices</strong> and help you negotiate!
                    </p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center px-4">
                    <div className="w-16 h-16 text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center flex-1 relative">
                    <div className="flex justify-center mb-6">
                        <BarChart2 size={48} className="text-green-500" />
                    </div>
                    <h3 className="text-xl text-green-600 font-semibold mb-4">
                        Financial Tracking
                    </h3>
                    <p className="text-gray-700">
                        View your <strong>balance sheet</strong> and manage your farm finances!
                    </p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center px-4">
                    <div className="w-16 h-16 text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* Step 4 */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center flex-1 relative">
                    <div className="flex justify-center mb-6">
                        <TrendingUp size={48} className="text-green-500" />
                    </div>
                    <h3 className="text-xl text-green-600 font-semibold mb-4">
                        Crop Prediction
                    </h3>
                    <p className="text-gray-700">
                        Get <strong>AI-powered predictions</strong> for optimal crop selection!
                    </p>
                </div>
            </div>


        </div>
    );
};

export default AgriTechSteps;