const User = require("../models/userModel"); // Import User model
const Podcast = require("../models/podcastModel");
const mongoose = require("mongoose");
const {getAllPodcasts} = require("../controllers/podcastController")

// Add podcast to favorites
const addFavorite = async (req, res) => {
  console.log("fsd");
  const { podcastId } = req.body; // Podcast ID from the request body
  const userId = req.params.userId; // Current user's ID from the URL param

  try {
    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the podcast is already in favorites
    if (user.favorites.includes(podcastId)) {
      return res
        .status(400)
        .json({ message: "Podcast is already in favorites" });
    }

    // Add the podcast to the favorites
    user.favorites.push(podcastId);
    await user.save();

    return res.status(200).json({
      message: "Podcast added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Error adding podcast to favorites:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all favorite podcasts for the current user
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.params._id; // Access userId from the URL params

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all podcasts
    const allPodcasts = await Podcast.find(); // Get all podcasts from the Podcast model

    // Match favorite podcast IDs with the full list of podcasts
    const favoritePodcasts = allPodcasts.filter(podcast => 
      user.favorites.includes(podcast._id.toString()) // Check if podcast ID exists in user's favorites
    );

    // Return the matched podcasts
    res.json(favoritePodcasts); // Send back the matched favorite podcasts
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const podcastExistsInFav = async (req, res) => {
  try {
    const { podcastId } = req.params; // Get podcastId from URL parameters
    console.log(podcastId);
    // Validate if the podcastId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(podcastId)) {
      return res.status(400).json({ error: "Invalid podcast ID format" });
    }

    const userId = req.user._id;

    // Find the user and check if the podcast exists in their favorites
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the podcastId exists in the user's favorites array
    const exists = user.favorites.includes(podcastId);

    if (exists) {
      return res.status(200).json({ exists: true });
    } else {
      return res
        .status(404)
        .json({ exists: false, message: "Podcast not found in favorites" });
    }
  } catch (error) {
    console.error("Error checking podcast existence:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const removeFromFav = async (req, res) => {
  console.log("i am here")
  try {
    const { podcastId } = req.params; // Get podcastId from URL parameters

    // Validate if the podcastId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(podcastId)) {
      return res.status(400).json({ error: "Invalid podcast ID format" });
    }

    const userId = req.user._id; // Get user ID from the authenticated user

    // Find the user and remove the podcastId from their favorites array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove podcastId from the favorites array
    const index = user.favorites.indexOf(podcastId);
    if (index !== -1) {
      user.favorites.splice(index, 1); // Remove podcastId from the array
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "Podcast removed from favorites" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Podcast not found in favorites" });
    }
  } catch (error) {
    console.error("Error removing podcast from favorites:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addFavorite,
  getUserFavorites,
  podcastExistsInFav,
  removeFromFav,
};
