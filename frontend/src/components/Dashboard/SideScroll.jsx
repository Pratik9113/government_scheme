import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Wheat, Tractor, Droplets, Coins, Users, Shield } from 'lucide-react';

const FarmerSchemesSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "सरकारी योजनाएं आपके लिए",
            englishTitle: "Government Schemes for You",
            subtitle: "अपनी पात्रता के अनुसार व्यक्तिगत योजनाएं खोजें",
            englishSubtitle: "Find Personalized Schemes Based on Your Eligibility",
            icon: <Wheat className="w-16 h-16 text-green-600" />,
            benefits: ["₹6,000 सालाना", "तुरंत आवेदन", "सभी किसानों के लिए"],
            bgColor: "bg-gradient-to-r from-green-100 to-emerald-50"
        },
        {
            title: "कृषि सहायता कार्यक्रम",
            englishTitle: "Agricultural Support Programs",
            subtitle: "किसानों के लिए वित्तीय सहायता और संसाधन",
            englishSubtitle: "Financial Aid and Resources for Farmers",
            icon: <Tractor className="w-16 h-16 text-blue-600" />,
            benefits: ["सब्सिडी पर उपकरण", "बीज सहायता", "तकनीकी मार्गदर्शन"],
            bgColor: "bg-gradient-to-r from-blue-100 to-sky-50"
        },
        {
            title: "सिंचाई और जल प्रबंधन",
            englishTitle: "Irrigation & Water Management",
            subtitle: "पानी की समस्या का समाधान",
            englishSubtitle: "Solutions for Water Scarcity Issues",
            icon: <Droplets className="w-16 h-16 text-cyan-600" />,
            benefits: ["ड्रिप सिंचाई सब्सिडी", "बोरवेल योजना", "पानी बचत तकनीक"],
            bgColor: "bg-gradient-to-r from-cyan-100 to-teal-50"
        },
        {
            title: "फसल बीमा योजना",
            englishTitle: "Crop Insurance Scheme",
            subtitle: "आपकी फसल, हमारी सुरक्षा",
            englishSubtitle: "Your Crops, Our Protection",
            icon: <Shield className="w-16 h-16 text-orange-600" />,
            benefits: ["प्राकृतिक आपदा से सुरक्षा", "कम प्रीमियम", "त्वरित क्लेम"],
            bgColor: "bg-gradient-to-r from-orange-100 to-amber-50"
        }
    ];

    // Auto slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Slides */}
            <div
                className="w-full h-full flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`min-w-full h-full ${slide.bgColor} flex flex-col md:flex-row items-center justify-center px-4 md:px-8 py-6`}
                    >
                        {/* Content Container */}
                        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center">
                            
                            {/* Left side - Icon and Visual */}
                            <div className="w-full md:w-2/5 flex flex-col items-center justify-center mb-6 md:mb-0">
                                <div className="bg-white rounded-full p-8 shadow-2xl mb-6">
                                    {slide.icon}
                                </div>
                                
                                {/* Decorative farming pattern */}
                                <div className="hidden md:flex flex-wrap justify-center gap-3 opacity-20">
                                    {Array(12).fill(0).map((_, i) => (
                                        <div key={i} className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
                                    ))}
                                </div>
                            </div>

                            {/* Right side - Content */}
                            <div className="w-full md:w-3/5 md:pl-8 text-center md:text-left">
                                {/* Hindi Title */}
                                <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-800 font-serif">
                                    {slide.title}
                                </h1>
                                
                                {/* English Title */}
                                <h2 className="text-lg md:text-xl font-medium mb-4 text-gray-600">
                                    {slide.englishTitle}
                                </h2>

                                {/* Hindi Subtitle */}
                                <p className="text-lg md:text-xl text-gray-700 mb-2 font-medium">
                                    {slide.subtitle}
                                </p>
                                
                                {/* English Subtitle */}
                                <p className="text-base md:text-lg text-gray-600 mb-6">
                                    {slide.englishSubtitle}
                                </p>

                                {/* Benefits */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {slide.benefits.map((benefit, i) => (
                                        <div key={i} className="bg-white bg-opacity-80 rounded-lg p-3 shadow-md">
                                            <div className="flex items-center justify-center md:justify-start">
                                                <Coins className="w-5 h-5 text-green-600 mr-2" />
                                                <span className="text-sm font-medium text-gray-800">{benefit}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Call to Action */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg transform hover:scale-105 transition-all">
                                        अभी आवेदन करें
                                    </button>
                                    <button className="bg-white hover:bg-gray-50 text-green-600 border-2 border-green-600 px-6 py-3 rounded-lg font-bold text-lg shadow-lg transform hover:scale-105 transition-all">
                                        और जानकारी
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Enhanced Navigation buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-green-600 p-3 rounded-full shadow-2xl z-30 hover:bg-green-50 transition-colors"
            >
                <ChevronLeft size={28} />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-green-600 p-3 rounded-full shadow-2xl z-30 hover:bg-green-50 transition-colors"
            >
                <ChevronRight size={28} />
            </button>

            {/* Enhanced Slide indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 backdrop-blur rounded-full px-4 py-2">
                <div className="flex space-x-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                currentSlide === index 
                                    ? 'bg-green-600 scale-125' 
                                    : 'bg-gray-400 hover:bg-gray-500'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Progress bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 z-40">
                <div 
                    className="h-full bg-green-600 transition-all duration-6000 ease-linear"
                    style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                />
            </div>

            {/* Slide counter */}
            <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur rounded-full px-4 py-2 text-sm font-bold text-gray-700 z-40">
                {currentSlide + 1} / {slides.length}
            </div>
        </div>
    );
};

export default FarmerSchemesSlider;