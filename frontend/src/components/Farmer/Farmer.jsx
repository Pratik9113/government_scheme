import React, { useState } from 'react';
import axios from "axios";
import Dashboard from '../BalanceSheet/Dashboard';

const FarmerDashboard = () => {
    const [activeTab, setActiveTab] = useState("submission");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

                    <button
                        className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === "balanceSheet" ? "bg-green-500" : "hover:bg-green-600"}`}
                        onClick={() => {
                            setActiveTab("balanceSheet")
                            setIsSidebarOpen(true);
                        }}
                    >
                        🛒 Balance Sheet
                    </button>

                    <button
                        className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === "cropPrediction" ? "bg-green-500" : "hover:bg-green-600"}`}
                        onClick={() => {
                            setActiveTab("cropPrediction")
                            setIsSidebarOpen(true);
                        }}
                    >
                        🛒 Crop Prediction
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                {activeTab === "submission" && <FarmerProductInterface />}
                {activeTab === "viewProducts" && <ProductManagement />}
                {activeTab === "balanceSheet" && <Dashboard isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />}
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
        <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-bold mb-4 text-center">Product Management</h2>

            <div className="space-y-3">
                {products.map((product) => (
                    <div key={product._id} className="bg-white p-3 border rounded shadow">
                        {editingProduct === product._id ? (
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-sm mb-1">Grain Type</label>
                                    <input
                                        type="text"
                                        name="grainType"
                                        value={editDetails.grainType}
                                        onChange={handleEditInputChange}
                                        className="p-1 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Crop Type</label>
                                    <input
                                        type="text"
                                        name="cropType"
                                        value={editDetails.cropType}
                                        onChange={handleEditInputChange}
                                        className="p-1 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Price per Kg (₹)</label>
                                    <input
                                        type="number"
                                        name="pricePerKg"
                                        value={editDetails.pricePerKg}
                                        onChange={handleEditInputChange}
                                        className="p-1 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Available Quantity (Kg)</label>
                                    <input
                                        type="number"
                                        name="availableQuantity"
                                        value={editDetails.availableQuantity}
                                        onChange={handleEditInputChange}
                                        className="p-1 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={editDetails.description}
                                        onChange={handleEditInputChange}
                                        className="p-1 border rounded w-full"
                                        rows="2"
                                    />
                                </div>
                                <div className="flex gap-2 justify-end mt-2">
                                    <button
                                        onClick={handleUpdateSubmit}
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingProduct(null)}
                                        className="bg-gray-500 text-white px-3 py-1 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="card-content">
                                <h3 className="font-medium">
                                    {product.cropType} - {product.grainType}
                                </h3>
                                <div className="text-sm mt-1">
                                    <p>Price: ₹{product.pricePerKg}/Kg</p>
                                    <p>Available: {product.availableQuantity} Kg</p>
                                    <p className="text-gray-600 mt-1">{product.description}</p>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleEditClick(product)}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(product._id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
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


