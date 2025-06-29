const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByPodcast,
  deleteComment, // <-- Import the new controller
} = require("../controllers/commentController");

const verifyUser = require("../utils/verifyUser");

router.post("/podcasts/:podcastId/comments", verifyUser, createComment);
router.get("/podcasts/:podcastId/comments", getCommentsByPodcast);
router.delete("/comments/:commentId", verifyUser, deleteComment); // <-- Add this line

module.exports = router;
