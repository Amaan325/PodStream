// src/pages/OTP.js
import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Auth from "./Auth";

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
    <div className="flex items-center justify-center h-screen bg-gray-900 pb-36">
      <div className="max-w-lg w-full bg-gray-800 rounded-3xl shadow-md p-6">
        <h1 className="font-semibold text-2xl text-white text-center my-9">
          Enter OTP
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            id="otp"
            placeholder="Enter OTP"
            className="bg-slate-200 rounded-lg p-2 text-[15px]"
            onChange={handleChange}
            value={otp} // Ensure input reflects the state
          />
          <button
            disabled={loading}
            className="bg-gray-500 text-[14px] text-white uppercase p-2 rounded-lg hover:bg-fuchsia-700 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Verify OTP"}
          </button>
          <Auth />
        </form>
        <div className="flex gap-2 items-center my-3">
          <p className="text-[15px] text-white">Didn't receive an OTP?</p>
          <NavLink to="/resend-otp">
            <span className="text-[15px] text-fuchsia-500 cursor-pointer font-semibold">
              Resend OTP
            </span>
          </NavLink>
        </div>
        <p className="text-red-500 text-[16px] ">
          {error && "Something went wrong!!!"}
        </p>
      </div>
    </div>
  );
};

export default OTP;
