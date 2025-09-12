import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Wheat, Building, Eye, EyeOff } from "lucide-react";

const Login = ({ setIsLogin }) => {
  const navigate = useNavigate();

  const [currState, setCurrState] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "Farmer",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

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
        localStorage.setItem("token", response.data.token);
        setIsLogin(true);
        toast.success("Successfully Logged In");
        if (response.data.message === "Farmer") navigate("/scheme-detail");
        else navigate("/vendor-detail");
      }
    } catch (error) {
      toast.error("User Not Registered or Wrong Credentials");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-green-50/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-green-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3">
            <Wheat className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">डिजीकिसान</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {currState === "SignUp" ? "अपना खाता बनाएं" : "अपने खाते में लॉगिन करें"}
          </p>
          {/* Toggle buttons */}
          <div className="flex justify-center mt-4 gap-2">
            <button
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                currState === "Login" ? "bg-green-600 text-white" : "text-gray-600 border"
              }`}
              onClick={() => setCurrState("Login")}
            >
              लॉगिन
            </button>
            <button
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                currState === "SignUp" ? "bg-green-600 text-white" : "text-gray-600 border"
              }`}
              onClick={() => setCurrState("SignUp")}
            >
              साइन अप
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onLogin} className="space-y-4">
          {currState === "SignUp" && (
            <>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={onChangeHandler}
                  placeholder="पूरा नाम दर्ज करें"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>

              <div className="flex space-x-3">
                {["Farmer", "Vendor"].map((role) => (
                  <div
                    key={role}
                    className={`flex-1 p-3 text-center border rounded-lg cursor-pointer ${
                      data.userType === role ? "border-green-500 bg-green-50" : "border-gray-300"
                    }`}
                    onClick={() => setData({ ...data, userType: role })}
                  >
                    {role === "Farmer" ? (
                      <Wheat className="mx-auto mb-1 w-5 h-5 text-green-600" />
                    ) : (
                      <Building className="mx-auto mb-1 w-5 h-5 text-green-600" />
                    )}
                    <span className="text-sm">{role === "Farmer" ? "किसान" : "व्यापारी"}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="relative">
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={onChangeHandler}
              placeholder="ईमेल दर्ज करें"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={onChangeHandler}
              placeholder="पासवर्ड दर्ज करें"
              required
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
          >
            {currState === "SignUp" ? "खाता बनाएं" : "लॉगिन करें"}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-4 text-sm text-gray-600">
          {currState === "Login" ? "क्या आपका खाता नहीं है?" : "पहले से खाता है?"}
          <span
            className="text-green-600 font-medium cursor-pointer ml-1 hover:underline"
            onClick={() => setCurrState(currState === "Login" ? "SignUp" : "Login")}
          >
            {currState === "Login" ? "साइन अप करें" : "लॉगिन करें"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;