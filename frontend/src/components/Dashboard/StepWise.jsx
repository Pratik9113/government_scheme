import React from "react";
import {
  Search,
  ShoppingCart,
  TrendingUp,
  Coins,
  MessageSquare,
  Shield,
  Users,
  Smartphone,
} from "lucide-react";

const AgriTechSteps = () => {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-green-600" />,
      title: "खोजें और तुलना करें",
      englishTitle: "Search & Compare",
      description: "बेहतरीन कीमतों के लिए अलग-अलग बाजारों की तुलना करें",
      englishDesc: "Compare different markets for the best prices",
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-blue-600" />,
      title: "सीधे बात करें",
      englishTitle: "Direct Communication",
      description: "खरीदारों से सीधे बात करें और बेहतर कीमत तय करें",
      englishDesc: "Communicate directly with buyers and negotiate better prices",
    },
    {
      icon: <ShoppingCart className="w-12 h-12 text-orange-600" />,
      title: "सुरक्षित लेन-देन",
      englishTitle: "Secure Transaction",
      description: "डिजिटल पेमेंट के साथ सुरक्षित व्यापार करें",
      englishDesc: "Trade securely with digital payment options",
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-purple-600" />,
      title: "मुनाफा बढ़ाएं",
      englishTitle: "Increase Profit",
      description: "बेहतर कीमत पाकर अपना मुनाफा बढ़ाएं",
      englishDesc: "Increase your profit by getting better prices",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-green-50 via-white to-emerald-50 py-20 px-6 relative overflow-hidden">
      {/* Decorative background dots */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-8 top-1/4 opacity-10">
          <div className="grid grid-cols-6 gap-3">
            {Array(30)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.12}s` }}
                ></div>
              ))}
          </div>
        </div>
        <div className="absolute right-8 bottom-1/4 opacity-10">
          <div className="grid grid-cols-6 gap-3">
            {Array(30)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }}
                ></div>
              ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-20 max-w-5xl mx-auto relative z-10">
        <div className="inline-flex items-center bg-green-100 rounded-full px-6 py-3 mb-6 shadow-sm">
          <Smartphone className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800 font-semibold">
            कैसे काम करता है • How It Works
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
          आसान स्टेप्स में शुरू करें
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 mb-2">
          Easy Steps to Start Your
        </p>
        <h3 className="text-3xl md:text-4xl font-bold text-green-600 mb-6">
          डिजिटल मार्केटप्लेस यात्रा
        </h3>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          अब बेचना हुआ और भी आसान - सीधे अपने फोन से बेहतरीन कीमत पाएं
        </p>
        <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto mt-3">
          Selling made easier - Get the best prices directly from your phone
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-green-100">
                {/* Number */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                    {index + 1}
                  </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6 mt-6">
                  <div className="p-5 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
                    {step.icon}
                  </div>
                </div>

                {/* Titles */}
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {step.title}
                </h3>
                <p className="text-green-600 font-medium mb-3">
                  {step.englishTitle}
                </p>

                {/* Description */}
                <p className="text-gray-700 font-medium mb-2 leading-relaxed">
                  {step.description}
                </p>
                <p className="text-gray-500 text-sm">{step.englishDesc}</p>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-green-400 opacity-80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-24 max-w-6xl mx-auto relative z-10">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-10 md:p-14 text-white shadow-2xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-2">
              क्यों चुनें हमारा मार्केटप्लेस?
            </h3>
            <p className="text-lg opacity-90">Why Choose Our Marketplace?</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5 shadow-md">
                <Users className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-semibold mb-1">10,000+ खरीदार</h4>
              <p className="opacity-90">Active Buyers</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5 shadow-md">
                <Shield className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-semibold mb-1">100% सुरक्षित</h4>
              <p className="opacity-90">Secure Platform</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5 shadow-md">
                <Coins className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-semibold mb-1">बेहतर कीमत</h4>
              <p className="opacity-90">Better Prices</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-10 inline-block max-w-md mx-auto border border-green-100 hover:shadow-2xl transition">
          <h4 className="text-2xl font-bold text-gray-900 mb-4">
            आज ही शुरू करें!
          </h4>
          <p className="text-gray-600 mb-6">
            अभी रजिस्टर करें और बेहतर कीमत पाना शुरू करें
          </p>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300">
            मार्केटप्लेस में जाएं
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgriTechSteps;
