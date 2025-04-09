const axios = require("axios");

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Keep it in .env for security

const searchYouTube = async (req, res) => {
  console.log("I am here");
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Search query is required." });
  }

  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        q: query,
        part: "snippet",
        type: "video",
        maxResults: 20,
        key: YOUTUBE_API_KEY,
      },
    });

    // Log the response to check if videoId exists
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("YouTube Search Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch YouTube results." });
  }
};

module.exports = { searchYouTube };
