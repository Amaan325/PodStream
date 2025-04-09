import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import animationData from "../assets/login.json"; // Replace with your animation JSON file
import {
  signInFailure,
  signInStart,
  signInSuccess,
  resetErrorMessage,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Auth from "../components/Auth";
import { FaArrowLeftLong } from "react-icons/fa6";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To access the state passed with navigation
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    if (!navigator.onLine) {
      dispatch(signInFailure({ error: "Network Error" }));
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/user/signin",
        formData,
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
        }
      );
      dispatch(signInSuccess(response.data.user));

      // Redirect to the page the user came from or homepage if no state is passed
      const redirectPath = location.state?.from || "/";
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const err = error.response?.data || { error: "An error occurred" };
      dispatch(signInFailure(err));
    }
  };

  useEffect(() => {
    dispatch(resetErrorMessage());
  }, [dispatch]);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-black px-6">
      {/* Back Button */}
      <div
        className="absolute top-6 left-6 flex items-center text-red-500 cursor-pointer"
        onClick={() => navigate(location.state?.from || "/")}
      >
        <FaArrowLeftLong size={24} />
        <span className="ml-2 text-white">Back</span>
      </div>

      <div className="-mt-20 flex items-center justify-center w-full max-w-7xl space-x-10">
        {/* Animation Section (Left) */}
        <div className="flex justify-center items-center w-[500px] h-[500px]">
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: "300px", height: "300px" }}
          />
        </div>

        {/* Form Section (Right) */}
        <div className="w-[600px] bg-black rounded-lg shadow-lg p-6">
          <h1 className="font-semibold text-3xl text-white text-center mb-6">
            Sign In
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              id="email"
              placeholder="Email"
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
              disabled={loading}
              className="bg-red-600 text-lg text-white uppercase p-3 rounded-lg hover:bg-red-700 disabled:opacity-70 transition-all w-full"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
            <Auth />
          </form>
          <div className="flex gap-2 items-center mt-5">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <NavLink to="/signup">
              <span className="text-sm text-red-500 cursor-pointer font-semibold hover:underline">
                Sign Up
              </span>
            </NavLink>
          </div>
          {error && (
            <p className="text-red-500 text-center text-sm mt-3">
              {error.error || "Something went wrong!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
