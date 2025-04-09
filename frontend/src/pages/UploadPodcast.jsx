import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Lottie from "lottie-react";
import { FaArrowLeftLong } from "react-icons/fa6";
import uploadanimation from "../assets/upload.json"; // Replace with your animation JSON file

const UploadPodcast = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null,
    tags: "",
    category: "",
    videoFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setProgress(0);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("thumbnail", formData.thumbnail);
    formDataToSend.append("tags", formData.tags);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("videoFile", formData.videoFile);

    try {
      await axios.post(
        `http://localhost:3000/podcasts/upload/${currentUser._id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-black px-6">
      {/* Back Button */}
      <div
        className="absolute top-6 left-6 flex items-center text-red-500 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeftLong size={24} />
        <span className="ml-2 text-white">Back</span>
      </div>

      <div className="flex items-center justify-center w-full max-w-7xl space-x-10">
        {/* Left Animation Section */}
        <div className="mt-80 flex flex-col items-center space-y-6">
          <Lottie
            animationData={uploadanimation}
            loop={true}
            autoplay={true}
            style={{ width: "300px", height: "300px" }}
          />
          <Lottie
            animationData={uploadanimation}
            loop={true}
            autoplay={true}
            style={{ width: "300px", height: "300px" }}
          />
           <Lottie
            animationData={uploadanimation}
            loop={true}
            autoplay={true}
            style={{ width: "300px", height: "300px" }}
          />
        </div>

        {/* Form Section (Center) */}
        <div className="mt-80 w-[600px] bg-black rounded-lg shadow-lg">
          <h1 className="font-semibold text-3xl text-white text-center mb-6">
            Upload Podcast
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Podcast Title */}
            <label htmlFor="title" className="text-white">
              Podcast Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter the podcast title"
              className="bg-gray-100 text-black rounded-lg p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all w-full"
              onChange={handleChange}
              required
            />

            {/* Description */}
            <label htmlFor="description" className="text-white">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter the podcast description"
              className="bg-gray-100 text-black rounded-lg p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all w-full h-36"
              onChange={handleChange}
              required
            />

            {/* Thumbnail */}
            <label htmlFor="thumbnail" className="text-white">
              Thumbnail (Image)
            </label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              className="bg-gray-100 text-black rounded-lg p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all w-full"
              onChange={handleChange}
              required
            />

            {/* Tags */}
            <label htmlFor="tags" className="text-white">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              placeholder="Enter tags (comma-separated)"
              className="bg-gray-100 text-black rounded-lg p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all w-full"
              onChange={handleChange}
            />

            {/* Category */}
            <label htmlFor="category" className="text-white">
              Category
            </label>
            <select
              id="category"
              className="bg-gray-100 text-black rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all w-full"
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Business">Business</option>
              <option value="Entertainment">Entertainment</option>
            </select>

            {/* Podcast File */}
            <label htmlFor="videoFile" className="text-white">
              Podcast (Video File)
            </label>
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              className="bg-gray-100 text-black rounded-lg p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all w-full"
              onChange={handleChange}
              required
            />

            {/* Submit Button */}
            <button
              disabled={loading}
              className="bg-red-600 text-lg text-white uppercase p-3 rounded-lg hover:bg-red-700 disabled:opacity-70 transition-all w-full"
            >
              {loading ? "Uploading..." : "Upload Podcast"}
            </button>
          </form>

          {/* Progress Bar */}
          {loading && (
            <div className="w-full bg-gray-600 rounded-full mt-6 h-2">
              <div
                className="bg-fuchsia-700 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center text-sm mt-3">
              Something went wrong! Please try again.
            </p>
          )}
        </div>

        {/* Right Animation Section */}
        <div className="mt-80 flex flex-col items-center space-y-6">
          <Lottie
            animationData={uploadanimation}
            loop={true}
            autoplay={true}
            style={{ width: "300px", height: "300px" }}
          />
          <Lottie
            animationData={uploadanimation}
            loop={true}
            autoplay={true}
            style={{ width: "300px", height: "300px" }}
          />
              <Lottie
            animationData={uploadanimation}
            loop={true}
            autoplay={true}
            style={{ width: "300px", height: "300px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadPodcast;
