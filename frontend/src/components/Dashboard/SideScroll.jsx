import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import assets from '../../assets/assets';
const GovernmentSchemesSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Discover government schemes for you...",
            subtitle: "Find Personalised Schemes Based of Eligibility",
            image: `${assets.slide1}`// Single image placeholder
        },
        {
            title: "Agricultural Support Programs",
            subtitle: "Access Funding and Resources for Farmers",
            image: `${assets.slide2}` // Single image placeholder
        },
        {
            title: "Rural Development Initiatives",
            subtitle: "Empowering Agricultural Communities",
            image: `${assets.slide3}` // Single image placeholder
        }
    ];

    // Auto slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative w-full h-screen bg-green-50 overflow-hidden">
            {/* Slides */}
            <div
                className="w-full h-full flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="min-w-full h-full flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-8"
                    >
                        {/* Left side with single image */}
                        <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-4">
                            <div className="relative w-full h-full max-w-lg">
                                <img
                                    src={slide.image}
                                    alt="Government scheme illustration"
                                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                                />
                            </div>
                        </div>

                        {/* Right side with text */}
                        <div className="w-full md:w-1/2 flex flex-col items-start justify-center text-left p-4 md:p-8">
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-green-800">
                                {slide.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-700 mb-8">
                                {slide.subtitle}
                            </p>

                            {/* // Dots pattern similar to the one in the image */}
                            <div className="grid grid-cols-8 gap-2 mb-6">
                                {Array(24).fill(0).map((_, i) => (
                                    <div key={i} className="w-2 h-2 bg-green-400 rounded-full"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-full shadow-lg z-30"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-full shadow-lg z-30"
            >
                <ChevronRight size={24} />
            </button>

            {/* Slide indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default GovernmentSchemesSlider;