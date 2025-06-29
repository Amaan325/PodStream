const mongoose = require("mongoose");

const Comment = new mongoose.Schema({
  podcast: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Podcast",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Comment", Comment);
