// import React, { useState } from 'react';
// import axios from "axios"
// const FarmerSubmissionForm = () => {
//     const [selectedGrain, setSelectedGrain] = useState('');
//     const [quantity, setQuantity] = useState('');
//     const [pricePerKg, setPricePerKg] = useState('');
//     const [notes, setNotes] = useState('');
//     const [status, setStatus] = useState({ type: '', message: '' });

//     const grainTypes = [
//         { value: 'wheat', label: 'Wheat' },
//         { value: 'rice', label: 'Rice' },
//         { value: 'gram', label: 'Gram' }
//     ];

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setStatus({ type: 'loading', message: 'Submitting prices...' });
//         const url = `${import.meta.env.VITE_BACKEND}/farmer/farmer-submission-form`;
//         try {

//             const response = await axios.post(url, {
//                 grainType: selectedGrain,
//                 quantity,
//                 pricePerKg,
//                 notes
//             }, {
//                 withCredentials: true,
//             })

//             if(response.data.data){
//                 alert("Successfully");

//             }

//             setStatus({ type: 'success', message: 'Prices submitted successfully! Buyers will be notified of your new prices.' });
//             setSelectedGrain('');
//             setQuantity('');
//             setPricePerKg('');
//             setNotes('');

//         } catch (error) {
//             setStatus({ type: 'error', message: 'Failed to submit prices. Please try again.' });
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto p-4">
//             <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                 <p className="text-blue-800 text-sm">
//                     Welcome! Submit your grain prices here. Our system will analyze your prices and connect you with potential buyers. Make sure to update your prices regularly for the best results.
//                 </p>
//             </div>

//             <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//                 <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//                     <h2 className="text-xl font-bold text-gray-800">Submit Grain Prices</h2>
//                     <p className="mt-1 text-sm text-gray-600">Enter the details of your grain stock below</p>
//                 </div>

//                 <div className="p-6">
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div>
//                             <label htmlFor="grain-type" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Select Grain Type
//                             </label>
//                             <select
//                                 id="grain-type"
//                                 value={selectedGrain}
//                                 onChange={(e) => setSelectedGrain(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//                                 required
//                             >
//                                 <option value="">Select a grain type</option>
//                                 {grainTypes.map(grain => (
//                                     <option key={grain.value} value={grain.value}>
//                                         {grain.label}
//                                     </option>
//                                 ))}
//                             </select>
//                             <p className="mt-1 text-sm text-gray-500">Choose the type of grain you want to sell</p>
//                         </div>

//                         <div>
//                             <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Available Quantity (kg)
//                             </label>
//                             <input
//                                 id="quantity"
//                                 type="number"
//                                 min="0"
//                                 value={quantity}
//                                 onChange={(e) => setQuantity(e.target.value)}
//                                 placeholder="Enter quantity"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 required
//                             />
//                             <p className="mt-1 text-sm text-gray-500">Enter the total quantity available for sale</p>
//                         </div>

//                         <div>
//                             <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Price per kg (₹)
//                             </label>
//                             <input
//                                 id="price"
//                                 type="number"
//                                 min="0"
//                                 step="0.01"
//                                 value={pricePerKg}
//                                 onChange={(e) => setPricePerKg(e.target.value)}
//                                 placeholder="Enter price"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 required
//                             />
//                             <p className="mt-1 text-sm text-gray-500">Set your desired selling price per kilogram</p>
//                         </div>

//                         {/* New Text Field for Additional Notes */}
//                         <div>
//                             <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Additional Information
//                             </label>
//                             <textarea
//                                 id="notes"
//                                 value={notes}
//                                 onChange={(e) => setNotes(e.target.value)}
//                                 placeholder="Enter any additional details about your grain (e.g., quality, storage conditions, preferred delivery method)"
//                                 rows="4"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
//                             />
//                             <p className="mt-1 text-sm text-gray-500">Optional: Add any relevant details about your grain</p>
//                         </div>

//                         {status.message && (
//                             <div className={`p-4 rounded-md ${status.type === 'error'
//                                 ? 'bg-red-50 text-red-700'
//                                 : status.type === 'success'
//                                     ? 'bg-green-50 text-green-700'
//                                     : 'bg-blue-50 text-blue-700'
//                                 }`}>
//                                 {status.message}
//                             </div>
//                         )}

//                         <button
//                             type="submit"
//                             disabled={status.type === 'loading' || !selectedGrain}
//                             className={`w-full py-2 px-4 rounded-md text-white font-medium
//                 ${(!selectedGrain || status.type === 'loading')
//                                     ? 'bg-blue-400 cursor-not-allowed'
//                                     : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
//                                 }`}
//                         >
//                             {status.type === 'loading' ? 'Submitting...' : 'Submit Price'}
//                         </button>

//                         <p className="text-xs text-gray-500 text-center mt-2">
//                             By submitting, your prices will be analyzed and shared with potential buyers in your area
//                         </p>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FarmerSubmissionForm;



import React from 'react';
import { Home, Building, Briefcase, GraduationCap, Heart, Building2, Scale, Atom, BarChart2, HandMetal } from 'lucide-react';

const FarmerSubmissionForm = () => {
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

export default FarmerSubmissionForm;