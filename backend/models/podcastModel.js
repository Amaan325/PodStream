const mongoose = require("mongoose");

const PodcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  tags: [String],
  category: { 
    type: String, 
    enum: ["Technology", "Education", "Health", "Lifestyle", "Business", "Entertainment"], // Add as many categories as needed
    required: true 
  },
  videoUrl: { type: String, required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to user
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Podcast", PodcastSchema);
