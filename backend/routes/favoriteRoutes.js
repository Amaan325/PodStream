const express = require("express");
const { addFavorite, getUserFavorites, podcastExistsInFav, removeFromFav } = require("../controllers/favoriteController");
const router = express.Router();
const verifyUser = require('../utils/verifyUser');

// Add podcast to favorites
router.post("/add/:userId", verifyUser, addFavorite);

// Get user's favorite podcasts
router.get("/get/:_id", verifyUser, getUserFavorites);

// Check if a podcast is in the user's favorites
router.get("/exists/:podcastId", verifyUser, podcastExistsInFav);

// Remove podcast from favorites
router.put("/remove/:podcastId", verifyUser, removeFromFav);

module.exports = router;
