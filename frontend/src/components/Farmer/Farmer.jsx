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
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Manage Your Products</h2>
            <div className="space-y-4">
                {products.map(product => (
                    <div key={product._id} className="p-4 border rounded-lg space-y-2">
                        {editingProduct === product._id ? (
                            <div className="space-y-2">
                                <input type="text" name="grainType" value={editDetails.grainType} onChange={handleEditInputChange} className="w-full p-2 border rounded" />
                                <input type="text" name="cropType" value={editDetails.cropType} onChange={handleEditInputChange} className="w-full p-2 border rounded" />
                                <input type="number" name="pricePerKg" value={editDetails.pricePerKg} onChange={handleEditInputChange} className="w-full p-2 border rounded" />
                                <input type="number" name="availableQuantity" value={editDetails.availableQuantity} onChange={handleEditInputChange} className="w-full p-2 border rounded" />
                                <textarea name="description" value={editDetails.description} onChange={handleEditInputChange} className="w-full p-2 border rounded min-h-[80px]" />
                                <div className="flex space-x-2">
                                    <button onClick={handleUpdateSubmit} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Update</button>
                                    <button onClick={() => setEditingProduct(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-600">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold">{product.cropType} - {product.grainType}</h3>
                                    <p>Price: ₹{product.pricePerKg}/Kg</p>
                                    <p>Available: {product.availableQuantity} Kg</p>
                                    <p className="text-sm text-gray-600">{product.description}</p>
                                </div>
                                <div className="space-x-2">
                                    <button onClick={() => handleEditClick(product)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                                    <button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};



export default FarmerDashboard;


