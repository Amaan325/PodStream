import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaArrowLeftLong } from "react-icons/fa6";
import Lottie from "lottie-react";
import uploadAnimation from "../assets/upload.json";

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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.videoFile || !formData.thumbnail) {
      setError("Please select both a video and thumbnail");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      const response = await axios.post(
        `http://localhost:3000/podcasts/upload/${currentUser._id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/podcasts"), 2000);
      } else {
        setError(response.data.message || "Upload failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-red-500 mb-8"
        >
          <FaArrowLeftLong className="mr-2" />
          Back
        </button>

        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Animation */}
          <div className="hidden lg:flex w-1/4 justify-center">
            <Lottie animationData={uploadAnimation} loop autoplay className="h-72" />
          </div>

          {/* Upload Form */}
          <div className="w-full lg:w-2/4 bg-gray-900 rounded-xl p-8 -mt-12">
            <h1 className="text-3xl font-bold mb-8 text-center">
              Upload New Podcast
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium">Podcast Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-gray-700 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 rounded bg-gray-700 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Thumbnail</label>
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Video File</label>
                  <input
                    type="file"
                    id="videoFile"
                    accept="video/*"
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Tags</label>
                  <input
                    type="text"
                    id="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="tech, education, etc."
                    className="w-full p-3 rounded bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-gray-700"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Technology">Technology</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all ${
                  loading ? "bg-red-800" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? "Uploading..." : "Upload Podcast"}
              </button>
            </form>

            {loading && (
              <div className="mt-4 p-3 bg-gray-800 rounded text-center">
                Processing your podcast. This may take a few minutes...
              </div>
            )}

            {success && (
              <div className="mt-4 p-3 bg-green-900 rounded text-center">
                Podcast uploaded successfully! Redirecting...
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-900 rounded text-center">
                {error}
              </div>
            )}
          </div>

          {/* Right Animation */}
          <div className="hidden lg:flex w-1/4 justify-center">
            <Lottie animationData={uploadAnimation} loop autoplay className="h-72" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPodcast;
