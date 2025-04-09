const express = require("express");
const router = express.Router();
const { searchYouTube } = require("../controllers/youtubeController");

// GET /api/youtube/search?q=your_query
router.get("/search", searchYouTube);

module.exports = router;
