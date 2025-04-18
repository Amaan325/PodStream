const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    podcastId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Podcast",
    },
    reason: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
