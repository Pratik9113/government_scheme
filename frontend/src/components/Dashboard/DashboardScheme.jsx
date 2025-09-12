import React from 'react';
import { FileText, Search, Clock, CheckCircle, Eye, ArrowRight } from 'lucide-react';
import assets from '../../assets/assets';

const MySchemeAbout = () => {
    const schemeFeatures = [
        {
            icon: <Search className="w-6 h-6 text-green-600" />,
            title: "500+ सरकारी योजनाएं खोजें",
            subtitle: "Find 500+ Government Schemes",
            description: "सभी केंद्र और राज्य सरकार की योजनाओं की जानकारी"
        },
        {
            icon: <FileText className="w-6 h-6 text-blue-600" />,
            title: "पात्रता की जांच करें",
            subtitle: "Check Your Eligibility", 
            description: "अपनी जानकारी के आधार पर योजना की पात्रता देखें"
        },
        {
            icon: <Clock className="w-6 h-6 text-orange-600" />,
            title: "तुरंत आवेदन करें",
            subtitle: "Apply Instantly",
            description: "ऑनलाइन आवेदन की सुविधा और स्टेटस ट्रैकिंग"
        }
    ];

    const popularSchemes = [
        {
            name: "PM-KISAN योजना",
            englishName: "PM-KISAN Scheme",
            benefit: "₹6,000 सालाना",
            description: "सभी किसानों के लिए आर्थिक सहायता"
        },
        {
            name: "फसल बीमा योजना", 
            englishName: "Crop Insurance Scheme",
            benefit: "फसल सुरक्षा",
            description: "प्राकृतिक आपदा से फसल का बीमा"
        },
        {
            name: "कृषि उपकरण सब्सिडी",
            englishName: "Agriculture Equipment Subsidy", 
            benefit: "50% तक सब्सिडी",
            description: "ट्रैक्टर और अन्य उपकरणों पर छूट"
        }
    ];

    return (
        <div className="bg-white py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
                
                {/* Left Content Section */}
                <div className="w-full lg:w-1/2">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="inline-flex items-center bg-green-100 rounded-full px-4 py-2 mb-4">
                            <FileText className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-green-800 font-semibold text-sm">सरकारी योजनाएं • Government Schemes</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            <span className="text-green-600">माई स्कीम</span> के बारे में
                        </h2>
                        <p className="text-xl text-gray-600 mb-6">About MyScheme Platform</p>
                        
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            भारत का सबसे बड़ा सरकारी योजना प्लेटफॉर्म जो आपको एक ही जगह सभी योजनाओं की 
                            जानकारी देता है और आवेदन में मदद करता है।
                        </p>
                        
                        <p className="text-gray-600 leading-relaxed mb-8">
                            India's largest government scheme platform that provides information about all 
                            schemes in one place and helps you with applications.
                        </p>
                    </div>

                    {/* Scheme Features */}
                    <div className="space-y-6 mb-8">
                        {schemeFeatures.map((feature, index) => (
                            <div key={index} className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="mr-4 p-2 bg-white rounded-lg shadow-sm">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm font-medium text-gray-600 mb-2">
                                        {feature.subtitle}
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => window.location.href = '/login'}
                            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all"
                        >
                            <Eye className="mr-2 w-5 h-5" />
                            योजनाएं देखें
                        </button>
                        <button className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all">
                            और जानकारी
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Right Section - Image + Popular Schemes */}
                <div className="w-full lg:w-1/2">
                    {/* Image */}
                    <div className="relative mb-8">
                        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src={assets.slide4}
                                alt="Farmer using myScheme app"
                                className="w-full h-64 md:h-80 object-cover"
                            />
                        </div>
                        {/* Floating badge */}
                        <div className="absolute -bottom-4 -right-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg">
                            <span className="font-bold">500+ योजनाएं</span>
                        </div>
                    </div>

                    {/* Popular Schemes */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                            लोकप्रिय योजनाएं
                        </h3>
                        <p className="text-center text-gray-600 mb-6">Popular Schemes</p>
                        
                        <div className="space-y-4">
                            {popularSchemes.map((scheme, index) => (
                                <div key={index} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 text-lg">
                                                {scheme.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-1">
                                                {scheme.englishName}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                {scheme.description}
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                                                {scheme.benefit}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center text-green-600 text-sm">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        <span>पात्रता जांचें और आवेदन करें</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MySchemeAbout;