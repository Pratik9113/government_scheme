// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const BuyerSection = () => {
//   const [buyers, setBuyers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBuyers = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_BACKEND}/buyers/get`, {
//           withCredentials: true
//         });
//         setBuyers(response.data.data);
//         console.log(response.data.data);
//       } catch (error) {
//         console.error("Error fetching buyers:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBuyers();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-4">Buyers List</h2>

//       {loading ? (
//         <p className="text-gray-700">Loading...</p>
//       ) : buyers.length === 0 ? (
//         <p className="text-gray-700">No buyers found.</p>
//       ) : (
//         <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="p-2 border">Buyer Name</th>
//                 <th className="p-2 border">Email</th>
//                 <th className="p-2 border">Quantity (Kg)</th>
//                 <th className="p-2 border">Price/Kg</th>
//                 <th className="p-2 border">Total Amount</th>
//                 <th className="p-2 border">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {buyers.map((buyer) => (
//                 <tr key={buyer._id} className="text-center border-t">
//                   <td className="p-2 border">{buyer.buyer?.name || "N/A"}</td>
//                   <td className="p-2 border">{buyer.buyer?.email || "N/A"}</td>
//                   <td className="p-2 border">{buyer.quantity}</td>
//                   <td className="p-2 border">{buyer.pricePerKg}</td>
//                   <td className="p-2 border">{buyer.totalAmount}</td>
//                   <td
//                     className={`p-2 border font-semibold ${buyer.status === "Accepted"
//                       ? "text-green-600"
//                       : buyer.status === "Rejected"
//                         ? "text-red-600"
//                         : "text-gray-600"
//                       }`}
//                   >
//                     {buyer.status}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BuyerSection;



import React, { useEffect, useState } from "react";
import axios from "axios";

const BuyerSection = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND}/buyers/get`, {
          withCredentials: true
        });
        setBuyers(response.data.data);
      } catch (error) {
        console.error("Error fetching buyers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  const openModal = (buyer) => setSelectedBuyer(buyer);
  const closeModal = () => setSelectedBuyer(null);

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 via-white to-green-100 min-h-screen">
      <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">🛒 Buyers List</h2>

      {loading ? (
        <p className="text-center text-gray-700">Loading...</p>
      ) : buyers.length === 0 ? (
        <p className="text-center text-gray-700">No buyers found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-2xl border border-green-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase">Buyer Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase">Email</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-green-800 uppercase">Quantity (Kg)</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-green-800 uppercase">Price/Kg</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-green-800 uppercase">Total</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-green-800 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {buyers.map((buyer) => (
                <tr
                  key={buyer._id}
                  className="hover:bg-green-50 cursor-pointer transition"
                  onClick={() => openModal(buyer)}
                >
                  <td className="px-6 py-4 text-sm text-gray-900">{buyer.buyer?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{buyer.buyer?.email || "N/A"}</td>
                  <td className="px-6 py-4 text-center text-sm">{buyer.quantity}</td>
                  <td className="px-6 py-4 text-center text-sm">₹{buyer.pricePerKg}</td>
                  <td className="px-6 py-4 text-center text-sm">₹{buyer.totalAmount}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border 
                      ${buyer.status === "Accepted" ? "bg-green-100 text-green-800 border-green-200"
                        : buyer.status === "Rejected" ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }`}>
                      {buyer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 👇 Modal for selected buyer */}
      {selectedBuyer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-1/2 p-6 relative">
            <button onClick={closeModal} className="absolute top-2 right-4 text-gray-500 hover:text-black text-xl">&times;</button>
            <h3 className="text-xl font-semibold text-green-800 mb-4">👤 Buyer Profile</h3>

            <div className="space-y-3 text-gray-800">
              <p><strong>Name:</strong> {selectedBuyer.buyer?.name || "N/A"}</p>
              <p><strong>Email:</strong> {selectedBuyer.buyer?.email || "N/A"}</p>
              <p><strong>Quantity:</strong> {selectedBuyer.quantity} Kg</p>
              <p><strong>Price/Kg:</strong> ₹{selectedBuyer.pricePerKg}</p>
              <p><strong>Total Amount:</strong> ₹{selectedBuyer.totalAmount}</p>
              <p><strong>Status:</strong>
                <span className={`ml-2 px-2 py-1 text-sm rounded-full border font-medium 
                  ${selectedBuyer.status === "Accepted" ? "bg-green-100 text-green-800 border-green-200"
                    : selectedBuyer.status === "Rejected" ? "bg-red-100 text-red-800 border-red-200"
                      : "bg-yellow-100 text-yellow-800 border-yellow-200"
                  }`}>
                  {selectedBuyer.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerSection;

