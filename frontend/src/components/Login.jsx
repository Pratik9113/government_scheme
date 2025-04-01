import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import './Login.css';

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
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-1 z-1">
            <div className="login-container">
                <div className="flex justify-between items-center text-black">
                    <h2 className="text-xl font-semibold">{currState}</h2>
                    {t("greeting")}
                </div>

                <form onSubmit={onLogin} className="mt-4 space-y-4">
                    {/* Show Name Input only in SignUp */}
                    {currState === "SignUp" && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={data.name}
                            onChange={onChangeHandler}
                            required
                            className="w-full p-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    )}

                    {/* Show User Type Selection only in SignUp */}
                    {currState === "SignUp" && (
                        <select
                            name="userType"
                            value={data.userType}
                            onChange={onChangeHandler}
                            required
                            className="w-full p-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="Farmer">Farmer</option>
                            <option value="Vendor">Vendor</option>
                        </select>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={data.email}
                        onChange={onChangeHandler}
                        required
                        className="w-full p-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={data.password}
                        onChange={onChangeHandler}
                        required
                        className="w-full p-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <button type="submit" className="login-button">
                        {currState === "SignUp" ? "Create an Account" : "Login"}
                    </button>
                </form>

                <div className="text-center mt-3 text-black">
                    <p>
                        {currState === "Login" ? "Create an account" : "Already have an account?"}
                        <span
                            className="text-green-600 font-semibold cursor-pointer ml-1"
                            onClick={() => setCurrState(currState === "Login" ? "SignUp" : "Login")}
                        >
                            {currState === "Login" ? "Click here" : "Login here"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
