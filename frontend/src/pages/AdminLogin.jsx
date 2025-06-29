import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/login.json";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios"; // Import Axios

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      if (response.data && response.data.token) {
        // Store both token and user data
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminData", JSON.stringify(response.data.user));
        
        // Set default authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        navigate("/admin/dashboard");
      } else {
        setError("Login failed: No token received");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Invalid credentials");
      } else {
        setError("Network error. Please try again later.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-black px-6">
      <div className="-mt-20 flex items-center justify-center w-full max-w-7xl space-x-10">
        <div className="flex justify-center items-center w-[500px] h-[500px]">
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{ width: "300px", height: "300px" }}
          />
        </div>

        <div className="w-[600px] bg-black rounded-lg shadow-lg p-6">
          <h1 className="font-semibold text-3xl text-white text-center mb-6">
            Admin Login
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              id="email"
              placeholder="Admin Email"
              className="bg-gray-100 text-black rounded-lg p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all w-full"
              onChange={handleChange}
              value={formData.email}
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="bg-gray-100 text-black rounded-lg p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all w-full"
              onChange={handleChange}
              value={formData.password}
            />
            <button
              className="bg-red-600 text-lg text-white uppercase p-3 rounded-lg hover:bg-red-700 transition-all w-full"
              type="submit"
            >
              Login
            </button>
          </form>
          {error && (
            <p className="text-red-500 text-center text-sm mt-3">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
