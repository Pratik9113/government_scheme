import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLogin }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        userType: "Farmer"
    });

    // Handle input changes
    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    // Handle login/sign-up submission
    const onLogin = async (event) => {
        event.preventDefault();
        let url = `${import.meta.env.VITE_BACKEND}/user`;

        url += currState === "Login" ? "/login" : "/signup";

        try {
            const response = await axios.post(url, data, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.data) {
                localStorage.setItem('token', response.data.token);
                setIsLogin(true);
                toast.success("Successfully Logged In");
                console.log(response.data.message);
                if (response.data.message == "Farmer") navigate("/scheme-detail");
                else navigate("/vendor-detail");
            }
        } catch (error) {
            toast.error("User Not Registered or Wrong Credentials");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-green-700">
                        {currState === "SignUp" ? "Sign Up" : "Login"}
                    </h2>
                    <span className="text-gray-500">{t("greeting")}</span>
                </div>

                <form onSubmit={onLogin} className="space-y-4">
                    {currState === "SignUp" && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={data.name}
                                onChange={onChangeHandler}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <select
                                name="userType"
                                value={data.userType}
                                onChange={onChangeHandler}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="Farmer">Farmer</option>
                                <option value="Vendor">Vendor</option>
                            </select>
                        </>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={data.email}
                        onChange={onChangeHandler}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={data.password}
                        onChange={onChangeHandler}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all duration-200"
                    >
                        {currState === "SignUp" ? "Create an Account" : "Login"}
                    </button>
                </form>

                <div className="text-center mt-4 text-sm text-gray-600">
                    {currState === "Login" ? "Don't have an account?" : "Already have an account?"}
                    <span
                        className="text-green-600 font-medium cursor-pointer ml-1 hover:underline"
                        onClick={() => setCurrState(currState === "Login" ? "SignUp" : "Login")}
                    >
                        {currState === "Login" ? "Sign Up" : "Login"}
                    </span>
                </div>
            </div>
        </div>

    );
};

export default Login;
