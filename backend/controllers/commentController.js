const Comment = require("../models/commentModel");

exports.createComment = async (req, res) => {
  try {
    const { podcastId } = req.params;
    const { text } = req.body;
    const comment = new Comment({
      podcast: podcastId,
      user: req.user.validUser._id, // Assumes user is added to req by verifyUser middleware
      text,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getCommentsByPodcast = async (req, res) => {
  try {
    const { podcastId } = req.params;
    const comments = await Comment.find({ podcast: podcastId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user deleting the comment is the one who posted it
    if (comment.user.toString() !== req.user.validUser._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this comment" });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
