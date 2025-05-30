import React from 'react';
import assets from '../../assets/assets';
import { Link } from 'react-router-dom';

const MySchemeAbout = () => {
    return (
        <div className="bg-white py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="w-full lg:w-1/2">
                    <h2 className="text-4xl font-bold text-green-600 mb-6">About</h2>

                    <p className="text-gray-700 mb-4 text-lg">
                        myScheme is a National Platform that aims to offer one-stop search
                        and discovery of the Government schemes.
                    </p>

                    <p className="text-gray-700 mb-4 text-lg">
                        It provides an innovative, technology-based solution to discover
                        scheme information based upon the eligibility of the citizen.
                    </p>

                    <p className="text-gray-700 mb-6 text-lg">
                        The platform helps the citizen to find the right Government schemes
                        for them. It also guides on how to apply for different Government
                        schemes. Thus no need to visit multiple Government websites.
                    </p>

                    <button className="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 font-medium rounded hover:bg-green-50 transition-colors">
                        <Link to="/login">View Mode</Link>
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </button>
                </div>

                <div className="w-full lg:w-1/2 relative">
                    <div className="rounded-lg overflow-hidden shadow-lg border-8 border-white">
                        <img
                            src={assets.slide4}
                            alt="Farmer using myScheme app in field"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MySchemeAbout;