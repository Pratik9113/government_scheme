import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useSearchParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
const Payment = () => {
    const navigate = useNavigate();
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [searchParams] = useSearchParams();
    const quantity = searchParams.get('quantity');
    const budget = searchParams.get('budget');
    const id = searchParams.get('id');
    const priceperkg = searchParams.get('priceperkg');
    console.log('Quantity:', quantity, 'Budget:', budget, 'id', id, "priceperkg", priceperkg);


    useEffect(() => {
        const loadRazorpayScript = () => {
            if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
                setRazorpayLoaded(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => setRazorpayLoaded(true);
            script.onerror = () => console.error("Razorpay script failed to load");
            document.body.appendChild(script);
        };

        if (!window.Razorpay) loadRazorpayScript();
        else setRazorpayLoaded(true);
    }, []);

    const paymentHandler = async () => {
        if (!razorpayLoaded || !window.Razorpay) {
            alert("Razorpay SDK is not available. Please refresh the page.");
            return;
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND}/razorpay/order`, { amount: budget });
            const { order_id, amount, currency, key } = data;

            console.log("Order Created:", data);

            const options = {
                key,
                amount,
                currency,
                order_id,
                name: "Your Company",
                description: "Test Transaction",
                handler: async (response) => {
                    alert("Payment successful!");
                    console.log("Payment Success Response:", response);

                    try {
                        await axios.post(`${import.meta.env.VITE_BACKEND}/razorpay/verify`, {
                            ...response,
                            id,
                            budget,
                            quantity,
                            priceperkg,
                        }, {
                            withCredentials: true,
                        });
                        alert("Payment verification successful.");
                        navigate("/buyer-section");
                    } catch (verifyError) {
                        console.error("Verification Error:", verifyError);
                        alert("Payment verification failed.");
                    }
                },
                prefill: {
                    name: "John Doe",
                    email: "john@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment Error:", error?.response || error);
            alert("Payment failed. Try again.");
        }
    };

    return (
        // <div>
        //     <h1>Razorpay Payment</h1>
        //     <button onClick={paymentHandler} disabled={!razorpayLoaded}>
        //         {razorpayLoaded ? "Pay Now" : "Loading..."}
        //     </button>
        // </div>

        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Razorpay Payment</h1>
                <button
                    onClick={paymentHandler}
                    disabled={!razorpayLoaded}
                    className={`px-6 py-3 text-lg font-semibold text-white rounded-xl transition-all duration-300 ${razorpayLoaded ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    {razorpayLoaded ? "Pay Now" : "Loading..."}
                </button>
            </div>
        </div>
    );
};

export default Payment;

