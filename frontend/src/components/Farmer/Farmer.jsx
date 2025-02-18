import React, { useState } from 'react';

const FarmerSubmissionForm = () => {
    const [selectedGrain, setSelectedGrain] = useState('');
    const [quantity, setQuantity] = useState('');
    const [pricePerKg, setPricePerKg] = useState('');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    const grainTypes = [
        { value: 'wheat', label: 'Wheat' },
        { value: 'rice', label: 'Rice' },
        { value: 'gram', label: 'Gram' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Submitting prices...' });

        try {
            const response = await fetch('/api/farmer/prices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    grainType: selectedGrain,
                    quantity,
                    pricePerKg,
                    notes
                })
            });

            if (!response.ok) throw new Error('Submission failed');

            setStatus({ type: 'success', message: 'Prices submitted successfully! Buyers will be notified of your new prices.' });
            setSelectedGrain('');
            setQuantity('');
            setPricePerKg('');
            setNotes('');

        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to submit prices. Please try again.' });
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                    Welcome! Submit your grain prices here. Our system will analyze your prices and connect you with potential buyers. Make sure to update your prices regularly for the best results.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Submit Grain Prices</h2>
                    <p className="mt-1 text-sm text-gray-600">Enter the details of your grain stock below</p>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="grain-type" className="block text-sm font-medium text-gray-700 mb-1">
                                Select Grain Type
                            </label>
                            <select
                                id="grain-type"
                                value={selectedGrain}
                                onChange={(e) => setSelectedGrain(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                required
                            >
                                <option value="">Select a grain type</option>
                                {grainTypes.map(grain => (
                                    <option key={grain.value} value={grain.value}>
                                        {grain.label}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-sm text-gray-500">Choose the type of grain you want to sell</p>
                        </div>

                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                Available Quantity (kg)
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                min="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Enter quantity"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">Enter the total quantity available for sale</p>
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Price per kg (₹)
                            </label>
                            <input
                                id="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={pricePerKg}
                                onChange={(e) => setPricePerKg(e.target.value)}
                                placeholder="Enter price"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">Set your desired selling price per kilogram</p>
                        </div>

                        {/* New Text Field for Additional Notes */}
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Information
                            </label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Enter any additional details about your grain (e.g., quality, storage conditions, preferred delivery method)"
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            />
                            <p className="mt-1 text-sm text-gray-500">Optional: Add any relevant details about your grain</p>
                        </div>

                        {status.message && (
                            <div className={`p-4 rounded-md ${status.type === 'error'
                                    ? 'bg-red-50 text-red-700'
                                    : status.type === 'success'
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-blue-50 text-blue-700'
                                }`}>
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status.type === 'loading' || !selectedGrain}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium
                ${(!selectedGrain || status.type === 'loading')
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                }`}
                        >
                            {status.type === 'loading' ? 'Submitting...' : 'Submit Price'}
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-2">
                            By submitting, your prices will be analyzed and shared with potential buyers in your area
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FarmerSubmissionForm;