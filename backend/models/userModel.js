const express = require("express");
const mongoose = require("mongoose");

// Assuming Podcast is another model that you have created
const Podcast = require("./podcastModel"); // Adjust the path if necessary

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Favorite podcasts, referenced as an array of Podcast objects
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Podcast",
      },
    ],
    // Liked podcasts
    likedPodcasts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Podcast",
      },
    ],
    // Disliked podcasts
    dislikedPodcasts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Podcast",
      },
    ],
    profilePicture: {
      type: String,
      default:
        "https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
