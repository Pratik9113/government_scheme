import React, { useState, useEffect } from 'react';



import {
    ChevronRight,
    ArrowUpRight,
    Bell,
    User
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);
import axios from 'axios';
function Dashboard() {
    const [theme, setTheme] = useState('dark');
    const [fullAmount, setFullAmount] = useState(0);
    const [predictedData, setPredictedData] = useState([]);

    const [buyers, setBuyers] = useState([]);
    const [top5Buyers, setTop5Buyers] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [monthlyProfit, setMonthlyProfit] = useState(0);



    const [salesData, setSalesData] = useState({
        labels: [],
        datasets: [],
    });
    useEffect(() => {
        axios.get('http://127.0.0.1:5000/predict')  // change URL if different
          .then(res => {
            setPredictedData(res.data);  // assuming res.data is an array of { month: 'May', profit: 1234 }
          })
          .catch(err => {
            console.error('Error fetching predicted data:', err);
          });
      }, []);
      
    useEffect(() => {
        const fetchBuyers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND}/buyers/get`, {
                    withCredentials: true
                });

                const buyerData = response.data.data;
                setBuyers(buyerData);

                const sortedBuyers = buyerData
                    .filter(entry => entry.buyer && entry.negotiation)
                    .sort((a, b) => b.totalAmount - a.totalAmount)
                    .slice(0, 5)
                    .map(entry => ({
                        grainType: entry.negotiation?.grainType ?? "Unknown",
                        buyerName: entry.buyer?.name ?? "N/A",
                        buyerEmail: entry.buyer?.email ?? "N/A",
                        quantity: entry.quantity,
                        pricePerKg: entry.pricePerKg,
                        totalAmount: entry.totalAmount,
                        status: entry.status
                    }));

                setTop5Buyers(sortedBuyers);


                const sortedRecentSales = buyerData
                    .filter(entry => entry.buyer && entry.negotiation)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
                    .slice(0, 5)
                    .map(entry => ({
                        name: entry.negotiation?.grainType ?? "Unknown",
                        status: entry.status ?? "Pending",
                        price: entry.totalAmount ?? 0,
                        items: entry.quantity ?? 0
                    }));

                setRecentSales(sortedRecentSales);

                // Group sales by month
                const monthlySales = {};

                // assuming entry.createdAt is ISO format
                buyerData.forEach(entry => {
                    if (entry.createdAt && entry.totalAmount) {
                        const date = new Date(entry.createdAt);
                        const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' }); // e.g., "Apr '25"

                        if (!monthlySales[monthYear]) {
                            monthlySales[monthYear] = 0;
                        }
                        monthlySales[monthYear] += entry.totalAmount;
                    }
                });

                // Convert to labels and data arrays
                const labels = Object.keys(monthlySales).sort((a, b) => {
                    const [aMonth, aYear] = a.split(" ");
                    const [bMonth, bYear] = b.split(" ");
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return new Date(`20${aYear}`, months.indexOf(aMonth)) - new Date(`20${bYear}`, months.indexOf(bMonth));
                });

                const data = labels.map(label => monthlySales[label]);

                // Update chart data
                setSalesData({
                    labels,
                    datasets: [
                        {
                            label: 'Profit (₹)',
                            data,
                            fill: false,
                            borderColor: theme === 'dark' ? '#fff' : '#4F46E5',
                            backgroundColor: theme === 'dark' ? 'rgba(5, 39, 237, 0.7)' : 'rgba(79, 70, 229, 0.2)',
                            tension: 0.4,
                        },
                    ],
                });
                console.log(salesData)



                // Get current month and year
                const now = new Date();
                const currentMonth = now.getMonth(); // 0-indexed
                const currentYear = now.getFullYear();

                // Filter and calculate this month's profit
                const thisMonthSales = buyerData.filter(entry => {
                    const saleDate = new Date(entry.updatedAt || entry.createdAt);
                    return (
                        saleDate.getMonth() === currentMonth &&
                        saleDate.getFullYear() === currentYear
                    );
                });

                const totalProfit = thisMonthSales.reduce(
                    (acc, sale) => acc + (sale.totalAmount || 0),
                    0
                );

                setMonthlyProfit(totalProfit);
            } catch (error) {
                console.error("Error fetching buyers:", error);
            }
        };

        fetchBuyers();
    }, []);


    // On mount, load saved theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Theme-based class variables
    const bgClass = theme === 'dark' ? 'bg-black' : 'bg-white';
    const textClass = theme === 'dark' ? 'text-white' : 'text-black';
    const borderClass = theme === 'dark' ? 'border-gray-200' : 'border-gray-300';
    const buttonHoverBg = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100';

    // Chart colors
    const chartBorderColor = theme === 'dark' ? '#FFFFFF' : '#000000';
    const chartLegendColor = theme === 'dark' ? '#FFFFFF' : '#000000';
    const multiColors = ["#EF4444", "#F59E0B", "#EAB308", "#10B981", "#3B82F6", "#8B5CF6"];

    // Line Chart for Sales Trend
    // const salesData = {
    //     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    //     datasets: [
    //         {
    //             label: 'Sales ($)',
    //             data: [12000, 15000, 10000, 17000, 19000, 22000],
    //             fill: false,
    //             borderColor: theme === 'dark' ? chartBorderColor : '#000000',
    //             tension: 0.4,
    //             pointBackgroundColor: theme === 'dark' ? chartBorderColor : multiColors,
    //             pointBorderColor: theme === 'dark' ? chartBorderColor : multiColors,
    //         },
    //     ],
    // };

    const salesOptions = {
        responsive: true,
        plugins: {
            legend: { display: true, labels: { color: chartLegendColor } },
            title: { display: false },
        },
        scales: {
            x: { ticks: { color: chartLegendColor }, grid: { color: theme === 'dark' ? '#333333' : '#dddddd' } },
            y: { ticks: { color: chartLegendColor }, grid: { color: theme === 'dark' ? '#333333' : '#dddddd' } }
        }
    };

    // Bar Chart for Profit Trend
    const profitData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Profit ($)',
                data: [5000, 7000, 3000, 8000, 10000, 12000],
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : multiColors,
            },
        ],
    };

    const profitOptions = {
        responsive: true,
        plugins: {
            legend: { display: true, labels: { color: chartLegendColor } },
            title: { display: false },
        },
        scales: {
            x: { ticks: { color: chartLegendColor }, grid: { color: theme === 'dark' ? '#333333' : '#dddddd' } },
            y: { ticks: { color: chartLegendColor }, grid: { color: theme === 'dark' ? '#333333' : '#dddddd' } }
        }
    };

    // Profit top section dummy values
    const profitValue = fullAmount;
    const profitPercentage = "12.5%";

    return (
        <div className={`flex h-screen ${bgClass}`}>
            {/* Inline CSS for custom toggle switch */}
            <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }
        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }
        input:checked + .slider {
          background-color: rgb(0, 0, 0);
        }
        input:focus + .slider {
          box-shadow: 0 0 1px rgb(1, 1, 1);
        }
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        .slider.round {
          border-radius: 24px;
        }
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {/* Top Bar */}
                <div className={`flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b ${borderClass} pb-4`}>
                    <h2 className={`text-2xl font-bold ${textClass} transition-transform duration-300 transform hover:scale-105`}>
                        Manufacturer Dashboard
                    </h2>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        {/* Custom toggle switch placed on the right */}
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={theme === 'light'}
                                onChange={toggleTheme}
                            />
                            <span className="slider round"></span>
                        </label>
                        <button className={`p-2 rounded-full ${buttonHoverBg} border ${borderClass} transition-transform duration-300 transform hover:scale-110`}>
                            <Bell className="w-6 h-6" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }} />
                        </button>
                        <button className={`p-2 rounded-full ${buttonHoverBg} border ${borderClass} transition-transform duration-300 transform hover:scale-110`}>
                            <User className="w-6 h-6" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }} />
                        </button>
                    </div>
                </div>

                {/* Profit Section */}
                <div className="mb-8">
                    <div className="grid grid-cols-1">
                        <div className={`p-8 rounded-lg border ${borderClass} shadow-md transition-all duration-300 transform hover:scale-105 ${bgClass}`}>
                            <div className="flex items-center space-x-2">
                                <h2 className={`text-3xl font-bold ${textClass}`}></h2>
                                <ArrowUpRight className="w-4 h-4" style={{ color: theme === 'dark' ? '#00FF00' : '#008000' }} />
                                <span className={`text-lg font-medium ${textClass}`}>Profit</span>
                            </div>
                            <p className={`text-5xl font-extrabold ${textClass}`}>{monthlyProfit}</p>
                        </div>
                    </div>
                </div>

                {/* Top Navigation (Breadcrumbs) */}
                <div className="flex items-center justify-between mb-8 transition-transform duration-300 transform hover:scale-105">
                    <div className={`flex items-center space-x-2 text-sm ${textClass}`}>
                        <span className="transition-colors duration-50 hover:text-gray-300">Overview</span>
                        <ChevronRight className="w-4 h-4" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }} />
                        <span className="font-medium transition-colors duration-300 hover:text-gray-300">Users</span>
                        <ChevronRight className="w-4 h-4" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }} />
                        <span className="transition-colors duration-300 hover:text-gray-300">Revenue</span>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Highest Selling Product */}
                    <div
                        className={`p-6 rounded-lg border ${borderClass} shadow-sm transition-all duration-300 transform hover:scale-105 ${bgClass}`}
                        style={{ animationDelay: '0.1s' }}
                    >
                        <h2 className={`text-lg font-semibold mb-4 flex items-center justify-between ${textClass}`}>
                            Highest Selling Product
                            <ArrowUpRight
                                className="w-5 h-5 transition-transform duration-300 transform hover:rotate-12"
                                style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}
                            />
                        </h2>

                        <div className="space-y-2">
                            <h3 className={`text-2xl font-bold ${textClass}`}>{top5Buyers[0]?.grainType || 'N/A'}</h3>

                            <div className={`space-y-2 ${textClass}`}>
                                <p className={`flex justify-between items-center border-b ${borderClass} pb-2`}>
                                    <span>Buyer Name:</span>
                                    <span className="font-medium">{top5Buyers[0]?.buyerName || 'N/A'}</span>
                                </p>
                                <p className={`flex justify-between items-center border-b ${borderClass} pb-2`}>
                                    <span>Buyer Email:</span>
                                    <span className="font-medium">{top5Buyers[0]?.buyerEmail || 'N/A'}</span>
                                </p>
                                <p className={`flex justify-between items-center border-b ${borderClass} pb-2`}>
                                    <span>Quantity Sold:</span>
                                    <span className="font-medium">{top5Buyers[0]?.quantity || 0}</span>
                                </p>
                                <p className={`flex justify-between items-center border-b ${borderClass} pb-2`}>
                                    <span>Price per Kg:</span>
                                    <span className="font-medium">₹{top5Buyers[0]?.pricePerKg || 0}</span>
                                </p>
                                <p className={`flex justify-between items-center border-b ${borderClass} pb-2`}>
                                    <span>Total Amount:</span>
                                    <span className="font-medium">₹{top5Buyers[0]?.totalAmount || 0}</span>
                                </p>
                                <p className="flex justify-between items-center">
                                    <span>Status:</span>
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium border border-yellow-200">
                                        {top5Buyers[0]?.status || 'Pending'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Top 5 Buyers */}
                    <div
                        className={`p-6 rounded-lg border ${borderClass} shadow-sm transition-all duration-300 transform hover:scale-105 ${bgClass}`}
                        style={{ animationDelay: '0.2s' }}
                    >
                        <h2 className={`text-lg font-semibold mb-4 flex items-center justify-between ${textClass}`}>
                            Top 5 Buyers
                            <ArrowUpRight
                                className="w-5 h-5 transition-transform duration-300 transform hover:rotate-12"
                                style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}
                            />
                        </h2>

                        <div className="space-y-3">
                            {top5Buyers.length === 0 ? (
                                <p className={textClass}>No buyer data available.</p>
                            ) : (
                                top5Buyers.map((buyer, index) => (
                                    <div
                                        key={index}
                                        className={`flex justify-between items-center p-2 ${buttonHoverBg} rounded transition-all duration-300 transform hover:scale-105 border ${borderClass}`}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`font-medium ${textClass}`}>{index + 1}. {buyer.buyerName}</span>
                                            <span className={`text-sm ${textClass}`}>Item: {buyer.grainType}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-semibold ${textClass}`}>₹{buyer.totalAmount}</span>
                                            <div className={`text-sm ${textClass}`}>@ ₹{buyer.pricePerKg}/kg</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>


                    {/* Sales Data */}
                    <div className={`p-6 rounded-lg border ${borderClass} shadow-sm transition-all duration-300 transform hover:scale-105 ${bgClass}`} style={{ animationDelay: '0.3s' }}>
                        <h2 className={`text-lg font-semibold mb-4 flex items-center justify-between ${textClass}`}>
                            Sales Data
                            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 transform hover:rotate-12" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }} />
                        </h2>
                        <div className={`flex justify-center items-center h-48 border ${borderClass} rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                            <div className="text-center">
                                <div className={`text-3xl font-bold ${textClass}`}>{top5Buyers[0]?.grainType || 'N/A'}: ₹{top5Buyers[0]?.totalAmount || 0}</div>
                                <div className={`mt-2 ${textClass}`}>Highest selling item</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Product History */}
                <div className={`mt-8 rounded-lg border ${borderClass} shadow-sm transition-all duration-300 ${bgClass}`} style={{ animationDelay: '0.4s' }}>
                    <div className="p-6">
                        <h2 className={`text-lg font-semibold mb-4 flex items-center justify-between ${textClass}`}>
                            Recent Product History
                            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 transform hover:rotate-12" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }} />
                        </h2>
                        <div className="overflow-x-auto">
                            <table className={`w-full border ${borderClass}`}>
                                <thead>
                                    <tr className={`text-left border-b ${borderClass} ${textClass}`}>
                                        <th className="pb-3 font-semibold">Name</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                        <th className="pb-3 font-semibold">Price</th>
                                        <th className="pb-3 font-semibold">Items Sold</th>
                                    </tr>
                                </thead>
                                <tbody className={textClass}>
                                    {recentSales.map((product, index) => (
                                        <tr
                                            key={index}
                                            className={`border-b ${borderClass} hover:bg-${theme === 'dark' ? 'gray-900' : 'gray-100'} transition-all duration-300`}
                                        >
                                            <td className="py-3 pl-4">{product.name}</td>
                                            <td className="py-3">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium border ${product.status === 'Available'
                                                        ? 'bg-green-100 text-green-800 border-green-200'
                                                        : product.status === 'Sold'
                                                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                                                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                        }`}
                                                >
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="py-3">₹{product.price.toLocaleString()}</td>
                                            <td className="py-3">{product.items}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>

                {/* Graphs Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-lg border ${borderClass} shadow-md transition-all duration-300 transform hover:scale-105 ${bgClass}`}>
                        <h2 className={`text-lg font-semibold mb-4 ${textClass}`}>Sales Trend</h2>
                        <Line data={salesData} options={salesOptions} />
                    </div>
                    <div className={`p-6 rounded-lg border ${borderClass} shadow-md transition-all duration-300 transform hover:scale-105 ${bgClass}`}>
                        <h2 className={`text-lg font-semibold mb-4 ${textClass}`}>Profit Trend</h2>
                        <Bar data={predictedData} options={predictedData} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;