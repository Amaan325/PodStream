const Report = require("../models/reportModel");
const Podcast = require("../models/podcastModel");
const User = require("../models/userModel");
const { getIO } = require("../socket");

// Create a new report
exports.createReport = async (req, res) => {
  const { podcastId } = req.params;
  const { reason } = req.body;
  const currentUser = req.user.newUser ? req.user.newUser : req.user.validUser;
  console.log("Current User:", currentUser);
  console.log("Creating report for podcast:", podcastId);
  try {
    const podcast = await Podcast.findById(podcastId).populate("uploader", "title");
    if (!podcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }
    console.log("Podcast found:", podcast._id, podcast.title);
    // Convert reason object to string if it's an object
    let reasonString = reason;
    if (typeof reason === "object") {
      reasonString = Object.entries(reason)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(", ");
    }

    const report = new Report({
      userId: currentUser._id,
      podcastId,
      reason: reasonString,
    });

    await report.save();

    const io = getIO();
    io.emit("newReport", {
      message: `New report for ${podcast.title}`,
      report: {
        id: report._id,
        reason: reasonString,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      podcast: {
        id: podcast._id,
        title: podcast.title,
        thumbnail: podcast.thumbnail || "/default-podcast.jpg",
        description: podcast.description,
        videoUrl: podcast.videoUrl,
        views: podcast.views,
      },
      reporter: {
        id: currentUser._id,
        username: currentUser.username,
      },
    });

    res.status(201).json({ message: "Podcast reported successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all reports and clean up stale ones
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("podcastId", "title")
      .populate("userId", "username");

    const validReports = [];
    const cleanupPromises = [];

    for (const report of reports) {
      if (report.podcastId) {
        validReports.push(report);
      } else {
        cleanupPromises.push(Report.findByIdAndDelete(report._id));
      }
    }

    if (cleanupPromises.length > 0) {
      await Promise.all(cleanupPromises);
      console.log(`🧹 Cleaned ${cleanupPromises.length} invalid reports`);
    }

    res.status(200).json(validReports);
  } catch (err) {
    console.error("Error in getReports:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get reports for a specific podcast
exports.getReportsByPodcast = async (req, res) => {
  try {
    const { podcastId } = req.params;
    const reports = await Report.find({ podcastId }).populate(
      "userId",
      "username"
    );
    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Resolve a report (mark as resolved)
exports.resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "Resolved";
    await report.save();

    res.status(200).json({ message: "Report marked as resolved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Review a report (mark as reviewed)
exports.reviewReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "Reviewed";
    await report.save();

    res.status(200).json({ message: "Report marked as reviewed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🚨 Delete all reports for a given podcast (when podcast is deleted)
exports.deleteReportsByPodcast = async (req, res) => {
  console.log("In rports seciton");
  console.log(req.params);
  const { podcastId } = req.params;

  try {
    const deleted = await Report.deleteMany({ podcastId });
    console.log("Deleted from reports section");
    res.status(200).json({
      message: `Deleted ${deleted.deletedCount} report(s) for podcast ${podcastId}`,
    });
  } catch (err) {
    console.error("Error deleting reports for podcast:", err);
    res.status(500).json({ message: "Server error" });
  }
};
