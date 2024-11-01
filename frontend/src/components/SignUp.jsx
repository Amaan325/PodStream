// src/pages/SignUp.js
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Auth from "./Auth";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const response = await axios.post(
        "http://localhost:3000/user/signup",
        formData,
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        setError(true);
      } else {
        // Navigate to /otp with only the email in state
        navigate("/otp", { state: { email: formData.email } });
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
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            id="username"
            placeholder="Username"
            className="bg-slate-200 rounded-lg p-2 text-[15px]"
            onChange={handleChange}
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="bg-slate-200 rounded-lg p-2 text-[15px]"
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="bg-slate-200 rounded-lg p-2 text-[15px]"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-gray-500 text-[14px] text-white uppercase p-2 rounded-lg hover:bg-fuchsia-700 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <Auth />
        </form>
        <div className="flex gap-2 items-center my-3">
          <p className="text-[15px] text-white">Have an account?</p>
          <NavLink to="/signin">
            <span className="text-[15px] text-fuchsia-500 cursor-pointer font-semibold">
              Sign In
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

export default SignUp;
