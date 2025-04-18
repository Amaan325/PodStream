import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/login.json"; // Same animation as SignIn
import { FaArrowLeftLong } from "react-icons/fa6";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hardcodedAdmin = {
      email: "admin@podcast.com",
      password: "admin1234",
    };

    if (
      formData.email === hardcodedAdmin.email &&
      formData.password === hardcodedAdmin.password
    ) {
      localStorage.setItem("isAdmin", true);
      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-black px-6">
      <div className="-mt-20 flex items-center justify-center w-full max-w-7xl space-x-10">
        {/* Animation */}
        <div className="flex justify-center items-center w-[500px] h-[500px]">
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: "300px", height: "300px" }}
          />
        </div>

        {/* Admin Login Form */}
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
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="bg-gray-100 text-black rounded-lg p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all w-full"
              onChange={handleChange}
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
