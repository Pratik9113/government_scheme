

import React from 'react';
import { Home, Building, Briefcase, GraduationCap, Heart, Building2, Scale, Atom, BarChart2, HandMetal } from 'lucide-react';

const DashboardScheme = () => {
    const schemes = [
        {
            icon: <Building className="w-8 h-8 text-olive-600" />,
            count: 417,
            title: "Agriculture, Rural & Environment",
            color: "bg-olive-50"
        },
        {
            icon: <Building2 className="w-8 h-8 text-orange-600" />,
            count: 215,
            title: "Banking, Financial Services and Insurance",
            color: "bg-orange-50"
        },
        {
            icon: <Briefcase className="w-8 h-8 text-blue-600" />,
            count: 461,
            title: "Business & Entrepreneurship",
            color: "bg-blue-50"
        },
        {
            icon: <GraduationCap className="w-8 h-8 text-red-600" />,
            count: 769,
            title: "Education & Learning",
            color: "bg-red-50"
        },
        {
            icon: <Heart className="w-8 h-8 text-teal-600" />,
            count: 214,
            title: "Health & Wellness",
            color: "bg-teal-50"
        },
        {
            icon: <Home className="w-8 h-8 text-blue-800" />,
            count: 93,
            title: "Housing & Shelter",
            color: "bg-blue-50"
        },
        {
            icon: <Scale className="w-8 h-8 text-red-800" />,
            count: 10,
            title: "Public Safety, Law & Justice",
            color: "bg-red-50"
        },
        {
            icon: <Atom className="w-8 h-8 text-teal-800" />,
            count: 61,
            title: "Science, IT & Communications",
            color: "bg-teal-50"
        },
        {
            icon: <BarChart2 className="w-8 h-8 text-yellow-800" />,
            count: 253,
            title: "Skills & Employment",
            color: "bg-yellow-50"
        },
        {
            icon: <HandMetal className="w-8 h-8 text-red-600" />,
            count: 1238,
            title: "Social welfare & Empowerment",
            color: "bg-red-50"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <nav className="flex justify-center space-x-8 text-sm font-medium">
                    <button className="px-4 py-2 bg-green-100 text-green-800 rounded-md">Categories</button>
                    <button className="px-4 py-2 hover:bg-gray-100 rounded-md">States/UTs</button>
                    <button className="px-4 py-2 hover:bg-gray-100 rounded-md">Central Ministries</button>
                </nav>
            </div>

            <h1 className="text-3xl font-bold text-center mb-12">Find schemes based on categories</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {schemes.map((scheme, index) => (
                    <div
                        key={index}
                        className={`${scheme.color} rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer`}
                    >
                        <div className="mb-4">
                            {scheme.icon}
                        </div>
                        <div className="text-lg font-semibold text-green-700 mb-2">
                            {scheme.count} Schemes
                        </div>
                        <h3 className="text-gray-800 font-medium">
                            {scheme.title}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardScheme;
