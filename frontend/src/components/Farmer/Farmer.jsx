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
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                {activeTab === "submission" && <FarmerProductInterface />}
                {activeTab === "viewProducts" && <ProductManagement />}
                {activeTab === "balanceSheet" && <Dashboard isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />}
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
