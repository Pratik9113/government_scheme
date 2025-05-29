import React, { useState } from 'react';
import axios from "axios";
import Dashboard from '../BalanceSheet/Dashboard';
import { Menu } from "lucide-react";

const FarmerDashboard = () => {
    const [activeTab, setActiveTab] = useState("submission");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Mobile Navbar */}
            <div className="flex items-center justify-between bg-green-700 text-white p-4 md:hidden">
                <h2 className="text-xl font-bold">Farmer Panel</h2>
                <button onClick={toggleSidebar}>
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Sidebar */}
            <div className={`bg-green-700 text-white w-full md:w-64 p-6 space-y-6 absolute md:static top-0 left-0 z-40 h-screen transform md:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                <h2 className="text-2xl font-bold text-center hidden md:block">Farmer Panel</h2>
                <nav className="space-y-4">
                    {["submission", "viewProducts", "balanceSheet", "cropPrediction"].map((tab, idx) => (
                        <button
                            key={idx}
                            className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === tab ? "bg-green-500" : "hover:bg-green-600"
                                }`}
                            onClick={() => {
                                setActiveTab(tab);
                                setIsSidebarOpen(false); // Close sidebar on mobile
                            }}
                        >
                            {tab === "submission" && "📋 Product Submission"}
                            {tab === "viewProducts" && "🛒 Manage Products"}
                            {tab === "balanceSheet" && "📊 Balance Sheet"}
                            {tab === "cropPrediction" && "🌾 Crop Prediction"}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 mt-4 md:mt-0">
                {activeTab === "submission" && <FarmerProductInterface />}
                {activeTab === "viewProducts" && <ProductManagement />}
                {activeTab === "balanceSheet" && (
                    <Dashboard isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                )}
                {activeTab === "cropPrediction" && <CropPrediction />}
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
    const [editingProduct, setEditingProduct] = useState(null);
    const [editDetails, setEditDetails] = useState({
        grainType: '',
        cropType: '',
        pricePerKg: '',
        availableQuantity: '',
        description: ''
    });

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND}/farmer/get-farmer-crop`, { withCredentials: true });
            setProducts(response.data.data);
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND}/farmer/delete-product/${id}`, { withCredentials: true });
            setProducts(products.filter(product => product._id !== id));
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product._id);
        setEditDetails({
            grainType: product.grainType,
            cropType: product.cropType,
            pricePerKg: product.pricePerKg,
            availableQuantity: product.availableQuantity,
            description: product.description,
        });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditDetails(prev => ({
            ...prev,
            [name]: name === 'pricePerKg' || name === 'availableQuantity' ? Number(value) : value
        }));
    };

    const handleUpdateSubmit = async () => {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND}/farmer/crop-update/${editingProduct}`,
                editDetails,
                { withCredentials: true }
            );

            if (response.data.success) {
                alert("Product Updated Successfully");
                setEditingProduct(null);
                fetchProducts(); // Refresh list
            }
        } catch (error) {
            console.error("Update Error:", error);
            alert("Failed to update product.");
        }
    };

    useState(() => { fetchProducts(); }, []);

    return (
        <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Manage Your Products</h2>

            <div className="space-y-4">
                {products.map((product) => (
                    <div key={product._id} className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md">
                        {editingProduct === product._id ? (
                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Grain Type</label>
                                        <input
                                            type="text"
                                            name="grainType"
                                            value={editDetails.grainType}
                                            onChange={handleEditInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                                        <input
                                            type="text"
                                            name="cropType"
                                            value={editDetails.cropType}
                                            onChange={handleEditInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price per Kg (₹)</label>
                                        <input
                                            type="number"
                                            name="pricePerKg"
                                            value={editDetails.pricePerKg}
                                            onChange={handleEditInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Available Quantity (Kg)</label>
                                        <input
                                            type="number"
                                            name="availableQuantity"
                                            value={editDetails.availableQuantity}
                                            onChange={handleEditInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={editDetails.description}
                                        onChange={handleEditInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        rows="3"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-2">
                                    <button
                                        onClick={() => setEditingProduct(null)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdateSubmit}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">
                                            {product.grainType} ({product.cropType})
                                        </h3>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Price:</span> ₹{product.pricePerKg}/kg
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Stock:</span> {product.availableQuantity} kg available
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product._id)}
                                            className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {product.description && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-sm text-gray-600">{product.description}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const CropPrediction = () => {
    const [formData, setFormData] = useState({
        N: "", P: "", K: "", temperature: "", humidity: "", ph: "", rainfall: "",
    });
    const [prediction, setPrediction] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/predict-crop", formData);
            setPrediction(res.data.suggested_crop);
        } catch (err) {
            alert("Something went wrong ❌");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
                <h1 className="text-3xl font-bold text-green-800 text-center mb-6">🌾 Crop Predictor</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {Object.keys(formData).map((key) => (
                        <div key={key} className="col-span-1">
                            <label className="block text-gray-600 capitalize mb-1">{key}</label>
                            <input
                                type="number"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                required
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="col-span-2 bg-green-600 text-white font-semibold rounded-xl py-2 hover:bg-green-700 transition duration-200"
                    >
                        {loading ? "Predicting..." : "Predict Crop"}
                    </button>
                </form>

                {prediction && (
                    <div className="mt-6 bg-lime-100 border border-lime-300 rounded-xl p-4 text-center">
                        <p className="text-lg text-green-700 font-semibold">
                            🧠 Recommended Crop: <span className="text-xl">{prediction}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}


export default FarmerDashboard;


