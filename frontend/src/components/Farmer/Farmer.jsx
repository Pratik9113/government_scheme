// import React, { useState } from 'react';
// import axios from "axios";

// const FarmerProductInterface = () => {
//     // State to manage form inputs
//     const [productDetails, setProductDetails] = useState({
//         grainType: '',
//         cropType: '',
//         pricePerKg: '',
//         availableQuantity: '',
//         description: ''
//     });

//     // Predefined crop types with icons
//     const cropTypes = [
//         { name: 'Wheat', icon: '🌾' },
//         { name: 'Rice', icon: '🍚' },
//         { name: 'Corn', icon: '🌽' },
//         { name: 'Barley', icon: '🌱' },
//         { name: 'Millet', icon: '🌿' },
//         { name: 'Sorghum', icon: '🌳' }
//     ];

//     // Predefined grain types
//     const grainTypes = [
//         'Basmati Rice',
//         'Long Grain Rice',
//         'Short Grain Rice',
//         'Hard Wheat',
//         'Soft Wheat',
//         'Durum Wheat'
//     ];

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProductDetails(prev => ({
//             ...prev,
//             [name]: name === 'pricePerKg' || name === 'availableQuantity' ? Number(value) : value
//         }));
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const url = `${import.meta.env.VITE_BACKEND}/farmer/farmer-submission-form`;

//         try {
//             const response = await axios.post(url, productDetails, {
//                 withCredentials: true,
//             });

//             if (response.data.success) {
//                 alert("Product Registered Successfully");
//                 setProductDetails({
//                     grainType: '',
//                     cropType: '',
//                     pricePerKg: '',
//                     availableQuantity: '',
//                     description: ''
//                 });
//             }
//         } catch (error) {
//             console.error("Submission Error:", error);
//             alert("Failed to register product. Please try again.");
//         }
//     };


//     return (
//         <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
//                 {/* Header Section */}
//                 <div className="bg-gradient-to-r from-green-600 to-green-800 p-6">
//                     <h1 className="text-3xl font-extrabold text-white text-center flex items-center justify-center">
//                         <span className="mr-4">🚜</span>
//                         Farmer's Product Registration
//                         <span className="ml-4">🌾</span>
//                     </h1>
//                 </div>

//                 {/* Form Container */}
//                 <form onSubmit={handleSubmit} className="p-8 space-y-6">
//                     {/* Crop Type Selection */}
//                     <div>
//                         <label className="block text-lg font-semibold text-green-800 mb-4">
//                             Select Crop Type
//                         </label>
//                         <div className="grid grid-cols-3 gap-4">
//                             {cropTypes.map((crop) => (
//                                 <div
//                                     key={crop.name}
//                                     onClick={() => setProductDetails(prev => ({
//                                         ...prev,
//                                         cropType: crop.name
//                                     }))}
//                                     className={`
//                     cursor-pointer p-4 rounded-xl text-center transition-all duration-300
//                     ${productDetails.cropType === crop.name
//                                             ? 'bg-green-600 text-white scale-105 shadow-lg'
//                                             : 'bg-green-100 hover:bg-green-200'}
//                   `}
//                                 >
//                                     <div className="text-4xl mb-2">{crop.icon}</div>
//                                     <span className="font-medium">{crop.name}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Grain Type Dropdown */}
//                     <div>
//                         <label className="block text-lg font-semibold text-green-800 mb-4">
//                             Select Grain Type
//                         </label>
//                         <select
//                             name="grainType"
//                             value={productDetails.grainType}
//                             onChange={handleInputChange}
//                             className="w-full p-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
//                         >
//                             <option value="">Choose Grain Type</option>
//                             {grainTypes.map((grain) => (
//                                 <option key={grain} value={grain}>
//                                     {grain}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Price and Quantity Inputs */}
//                     <div className="grid md:grid-cols-2 gap-6">
//                         <div>
//                             <label className="block text-lg font-semibold text-green-800 mb-2">
//                                 Price per Kg (₹)
//                             </label>
//                             <input
//                                 type="number"
//                                 name="pricePerKg"
//                                 value={productDetails.pricePerKg}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter price"
//                                 className="w-full p-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-lg font-semibold text-green-800 mb-2">
//                                 Available Quantity (Kg)
//                             </label>
//                             <input
//                                 type="number"
//                                 name="availableQuantity"
//                                 value={productDetails.availableQuantity}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter quantity"
//                                 className="w-full p-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
//                             />
//                         </div>
//                     </div>

//                     {/* Description Textarea */}
//                     <div>
//                         <label className="block text-lg font-semibold text-green-800 mb-2">
//                             Product Description
//                         </label>
//                         <textarea
//                             name="description"
//                             value={productDetails.description}
//                             onChange={handleInputChange}
//                             placeholder="Describe your product's quality, origin, and unique features"
//                             className="w-full p-3 border-2 border-green-300 rounded-xl min-h-[150px] focus:ring-2 focus:ring-green-500 focus:outline-none"
//                         />
//                     </div>

//                     {/* Submit Button */}
//                     <button
//                         type="submit"
//                         className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-colors duration-300 text-xl font-bold shadow-lg hover:shadow-xl"
//                     >
//                         Register Your Product
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default FarmerProductInterface;



import React, { useState } from 'react';
import axios from "axios";

const FarmerDashboard = () => {
    const [activeTab, setActiveTab] = useState("submission");

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-green-700 text-white p-6 space-y-6">
                <h2 className="text-2xl font-bold text-center">Farmer Panel</h2>
                <nav className="space-y-4">
                    <button
                        className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === "submission" ? "bg-green-500" : "hover:bg-green-600"}`}
                        onClick={() => setActiveTab("submission")}
                    >
                        📋 Product Submission
                    </button>
                    <button
                        className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === "viewProducts" ? "bg-green-500" : "hover:bg-green-600"}`}
                        onClick={() => setActiveTab("viewProducts")}
                    >
                        🛒 Manage Products
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                {activeTab === "submission" && <FarmerProductInterface />}
                {activeTab === "viewProducts" && <ProductManagement />}
            </div>
        </div>
    );
};

const FarmerProductInterface = () => {
    const [productDetails, setProductDetails] = useState({
        grainType: '',
        cropType: '',
        pricePerKg: '',
        availableQuantity: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductDetails(prev => ({
            ...prev,
            [name]: name === 'pricePerKg' || name === 'availableQuantity' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND}/farmer/farmer-submission-form`, productDetails, {
                withCredentials: true,
            });
            if (response.data.success) {
                alert("Product Registered Successfully");
                setProductDetails({ grainType: '', cropType: '', pricePerKg: '', availableQuantity: '', description: '' });
            }
        } catch (error) {
            console.error("Submission Error:", error);
            alert("Failed to register product. Please try again.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Register Your Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="grainType" value={productDetails.grainType} onChange={handleInputChange} placeholder="Grain Type" className="w-full p-3 border rounded" required />
                <input type="text" name="cropType" value={productDetails.cropType} onChange={handleInputChange} placeholder="Crop Type" className="w-full p-3 border rounded" required />
                <input type="number" name="pricePerKg" value={productDetails.pricePerKg} onChange={handleInputChange} placeholder="Price Per Kg" className="w-full p-3 border rounded" required />
                <input type="number" name="availableQuantity" value={productDetails.availableQuantity} onChange={handleInputChange} placeholder="Available Quantity" className="w-full p-3 border rounded" required />
                <textarea name="description" value={productDetails.description} onChange={handleInputChange} placeholder="Product Description" className="w-full p-3 border rounded min-h-[100px]" required />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Submit</button>
            </form>
        </div>
    );
};

const ProductManagement = () => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND}/farmer/products`, { withCredentials: true });
            setProducts(response.data);
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND}/farmer/products/${id}`, { withCredentials: true });
            setProducts(products.filter(product => product._id !== id));
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    useState(() => { fetchProducts(); }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Manage Your Products</h2>
            <div className="space-y-4">
                {products.map(product => (
                    <div key={product._id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">{product.cropType} - {product.grainType}</h3>
                            <p>Price: ₹{product.pricePerKg}/Kg</p>
                            <p>Available: {product.availableQuantity} Kg</p>
                        </div>
                        <button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FarmerDashboard;
