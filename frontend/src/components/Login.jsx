import React, { useState } from 'react'
import axios from "axios"
import { toast } from 'react-toastify';
import { ImCross } from "react-icons/im";
import './Login.css'

const Login = ({ setIsLogin, setIsGuestLogin }) => {
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = `${import.meta.env.VITE_BACKEND}`;
        if (currState === 'Login') {
            newUrl += "/user/login";
        } else {
            newUrl += "/user/signup";
        }

        try {
            const response = await axios.post(newUrl, data, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.data) {
                setIsLogin(true);  // Successfully logged in
                toast.success(response.data.message);
            }
        } catch (error) {
            alert("Unsuccessfully login/signup");
            toast.error("User Not Registered or wrong credentials");
        }
    }

    // Handle guest login (bypassing login/signup)
    const onGuestLogin = () => {
        setIsGuestLogin(true);
        toast.success("Logged in as Guest");
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-1 z-1">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <div className="flex justify-between items-center text-black">
                    <h2 className="text-xl font-semibold">{currState}</h2>
                    <ImCross
                        onClick={() => setIsLogin(false)}
                        className="cursor-pointer text-xl"
                    />
                </div>

                <form onSubmit={onLogin} className="mt-4 space-y-4">
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
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={data.email}
                        onChange={onChangeHandler}
                        required
                        className="w-full p-2  text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={data.password}
                        onChange={onChangeHandler}
                        required
                        className="w-full p-2  text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white p-2 rounded-md font-semibold hover:bg-red-600 transition duration-300"
                    >
                        {currState === "SignUp" ? "Create an Account" : "Login"}
                    </button>
                </form>

                <div className="text-center mt-3 text-black">
                    <p>
                        {currState === "Login" ? "Create an account" : "Already have an account?"}
                        <span
                            className="text-red-500 font-semibold cursor-pointer ml-1"
                            onClick={() => setCurrState(currState === "Login" ? "SignUp" : "Login")}
                        >
                            {currState === "Login" ? "Click here" : "Login here"}
                        </span>
                    </p>
                    {/* Guest Login Button */}
                    <button
                        onClick={onGuestLogin}
                        className="w-full bg-gray-300 text-black p-2 rounded-md font-semibold hover:bg-gray-400 transition duration-300 mt-4"
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
