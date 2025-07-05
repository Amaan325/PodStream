const mongoose = require("mongoose");

const PodcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  tags: [String],
  category: {
    type: String,
    enum: [
      "Technology",
      "Education",
      "Health",
      "Lifestyle",
      "Business",
      "Entertainment",
    ],
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
   likes: { 
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],  
  videoUrl: { type: String, required: true }, // HLS (.m3u8) for streaming
  downloadUrl: { type: String, required: true }, // Original .mp4 for download
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Podcast", PodcastSchema);
