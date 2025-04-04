import React, { useEffect, useState } from "react";
import axios from "axios";

const BuyerSection = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND}/buyers/get`, {
          withCredentials: true
        });
        setBuyers(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching buyers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Buyers List</h2>

      {loading ? (
        <p className="text-gray-700">Loading...</p>
      ) : buyers.length === 0 ? (
        <p className="text-gray-700">No buyers found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Buyer Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Quantity (Kg)</th>
                <th className="p-2 border">Price/Kg</th>
                <th className="p-2 border">Total Amount</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((buyer) => (
                <tr key={buyer._id} className="text-center border-t">
                  <td className="p-2 border">{buyer.buyer?.name || "N/A"}</td>
                  <td className="p-2 border">{buyer.buyer?.email || "N/A"}</td>
                  <td className="p-2 border">{buyer.quantity}</td>
                  <td className="p-2 border">{buyer.pricePerKg}</td>
                  <td className="p-2 border">{buyer.totalAmount}</td>
                  <td
                    className={`p-2 border font-semibold ${buyer.status === "Accepted"
                      ? "text-green-600"
                      : buyer.status === "Rejected"
                        ? "text-red-600"
                        : "text-gray-600"
                      }`}
                  >
                    {buyer.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BuyerSection;
