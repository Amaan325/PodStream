import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Auth from "./Auth";
import Lottie from "lottie-react";
import { FaArrowLeftLong } from "react-icons/fa6";
import otpanimation from "../assets/otp.json"; // Replace with your animation JSON file

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // Get email from state
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const response = await axios.post(
        "http://localhost:3000/user/signup/otp",
        { email, otp }, // Send both email and OTP
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      if (response.status !== 200) {
        setError(true);
      } else {
        navigate("/signin");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="-mt-9 flex items-center justify-center w-full h-screen bg-black px-6">
      {/* Back Button */}
      <div
        className="absolute top-6 left-6 flex items-center text-red-500 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeftLong size={24} />
        <span className="ml-2 text-white">Back</span>
      </div>

      <div className="flex items-center justify-center w-full max-w-7xl space-x-10">
        {/* Animation Section (Left) */}
        <div className="flex justify-center items-center w-[500px] h-[500px]">
          <Lottie
            animationData={otpanimation}
            loop={true}
            autoplay={true}
            style={{ width: "700px", height: "400px" }}
          />
        </div>

        {/* Form Section (Right) */}
        <div className="w-[600px] bg-black rounded-lg shadow-lg">
          <h1 className="font-semibold text-3xl text-white text-center mb-6">
            Enter OTP
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              id="otp"
              placeholder="Enter OTP"
              className="bg-gray-100 text-black rounded-lg p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all w-full"
              onChange={handleChange}
              value={otp} // Ensure input reflects the state
            />
            <button
              disabled={loading}
              className="bg-red-600 text-lg text-white uppercase p-3 rounded-lg hover:bg-red-700 disabled:opacity-70 transition-all w-full"
            >
              {loading ? "Loading..." : "Verify OTP"}
            </button>
            <Auth />
          </form>
          <div className="flex gap-2 items-center mt-5">
            <p className="text-sm text-gray-600">Didn't receive an OTP?</p>
            <NavLink to="/resend-otp">
              <span className="text-sm text-red-500 cursor-pointer font-semibold hover:underline">
                Resend OTP
              </span>
            </NavLink>
          </div>
          {error && (
            <p className="text-red-500 text-center text-sm mt-3">
              Something went wrong!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTP;
