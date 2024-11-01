// src/pages/UploadPodcast.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

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
    const formDataToSend = new FormData();

    // Append podcast data
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
    <div className="flex justify-center pt-20 bg-gray-900 min-h-screen">
      <div className="w-full max-w-4xl bg-gray-800 rounded-3xl shadow-md p-8">
        <h1 className="font-semibold text-2xl text-white text-center mb-8">
          Upload Podcast
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            id="title"
            placeholder="Podcast Title"
            className="bg-slate-200 rounded-lg p-3 text-[15px] w-full"
            onChange={handleChange}
            required
          />
          <textarea
            id="description"
            placeholder="Description"
            className="bg-slate-200 rounded-lg p-3 text-[15px] h-24 w-full"
            onChange={handleChange}
            required
          />
          <label className="text-white mt-2" htmlFor="thumbnail">
            Upload Thumbnail (Image File):
          </label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            className="bg-slate-200 rounded-lg p-3 text-[15px] w-full"
            onChange={handleChange}
            required
          />
          <label className="text-white mt-2" htmlFor="tags">
            Tags (comma-separated):
          </label>
          <input
            type="text"
            id="tags"
            placeholder="e.g. tech, podcast, education"
            className="bg-slate-200 rounded-lg p-3 text-[15px] w-full"
            onChange={handleChange}
          />
          <label className="text-white mt-2" htmlFor="category">
            Category:
          </label>
          <select
            id="category"
            className="bg-slate-200 rounded-lg p-3 text-[15px] w-full"
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

          <label className="text-white mt-2" htmlFor="videoFile">
            Upload Podcast Video (Video File):
          </label>
          <input
            type="file"
            id="videoFile"
            accept="video/*"
            className="bg-slate-200 rounded-lg p-3 text-[15px] w-full"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-500 text-[14px] text-white uppercase p-3 rounded-lg hover:bg-fuchsia-700 disabled:opacity-80 w-full mt-4"
          >
            {loading ? "Uploading..." : "Upload Podcast"}
          </button>
        </form>
        {error && (
          <p className="text-red-500 text-[16px] mt-3 text-center">
            Something went wrong! Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadPodcast;
