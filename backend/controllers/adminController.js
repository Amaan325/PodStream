const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Report = require("../models/reportModel");
const Podcast = require("../models/podcastModel");
const bcrypt = require("bcrypt");
const { getIO } = require("../socket");
// Admin Login
// In your adminController.js
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find admin user
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // // 2. Verify password
    // const isMatch = await bcrypt.compare(password, admin.password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: "Invalid admin credentials" });
    // }

    // 3. Generate token
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
        email: admin.email,
      },
      process.env.JWT_SECRET || process.env.SECRET_KEY,
      { expiresIn: "8h" }
    );

    // 4. Respond with token and minimal user data
    res.json({
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during admin login" });
  }
};

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("userId", "username")
      .populate("podcastId", "title thumbnailUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a podcast and related reports
exports.deletePodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findByIdAndDelete(req.params.id);
    if (!podcast) return res.status(404).json({ message: "Podcast not found" });

    await Report.deleteMany({ podcastId: req.params.id });
    res.status(200).json({ message: "Podcast and related reports deleted" });
  } catch (err) {
    console.error("Error deleting podcast:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark a report as reviewed
exports.markReportReviewed = async (req, res) => {
  try {
    const updated = await Report.findByIdAndUpdate(req.params.id, {
      status: "Reviewed",
    });
    if (!updated) return res.status(404).json({ message: "Report not found" });

    res.status(200).json({ message: "Marked as reviewed" });
  } catch (err) {
    console.error("Error marking report reviewed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark a report as resolved
exports.markReportResolved = async (req, res) => {
  try {
    const updated = await Report.findByIdAndUpdate(req.params.id, {
      status: "Resolved",
    });
    if (!updated) return res.status(404).json({ message: "Report not found" });

    res.status(200).json({ message: "Marked as resolved" });
  } catch (err) {
    console.error("Error marking report resolved:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get summary of total podcasts, reports, and users
exports.getSummary = async (req, res) => {
  console.log("here in summary");
  try {
    const [totalPodcasts, totalReports, totalUsers] = await Promise.all([
      Podcast.countDocuments(),
      Report.countDocuments(),
      User.countDocuments(),
    ]);
     console.log(totalPodcasts, totalReports, totalUsers);
    res.status(200).json({
      totalPodcasts,
      totalReports,
      totalUsers,
    });
  } catch (err) {
    console.error("Error in admin summary:", err);
    res.status(500).json({ message: "Server error" });
  }
};
