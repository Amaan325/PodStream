const Report = require("../models/reportModel");
const Podcast = require("../models/podcastModel");
const User = require("../models/userModel");
const { getIO } = require("../socket");

exports.createReport = async (req, res) => {
  const { podcastId } = req.params;
  const { reason } = req.body;
  const currentUser = req.user;

  try {
    const podcast = await Podcast.findById(podcastId);
    if (!podcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    // Convert reason object to string if it's an object
    let reasonString = reason;
    if (typeof reason === 'object') {
      reasonString = Object.entries(reason)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(', ');
    }

    const report = new Report({
      userId: currentUser._id,
      podcastId,
      reason: reasonString,
    });

    await report.save();

    const io = getIO();
    
    // Emit with timestamp
    io.emit("newReport", {
      message: `New report for ${podcast.title}`,
      report: {
        id: report._id,
        reason: reasonString,
        status: "pending",
        createdAt: new Date().toISOString() // Add timestamp
      },
      podcast: {
        id: podcast._id,
        title: podcast.title,
        thumbnail: podcast.thumbnail || "/default-podcast.jpg",
        description: podcast.description,
        videoUrl: podcast.videoUrl,
        views: podcast.views
      },
      reporter: {
        id: currentUser._id,
        username: currentUser.username
      }
    });

    res.status(201).json({ message: "Podcast reported successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// Get all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("podcastId", "title")
      .populate("userId", "username")
      .exec();

    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get reports for a specific podcast
exports.getReportsByPodcast = async (req, res) => {
  try {
    const { podcastId } = req.params;
    const reports = await Report.find({ podcastId })
      .populate("userId", "username")
      .exec();

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

    // Mark the report as resolved
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

    // Mark the report as reviewed
    report.status = "Reviewed";
    await report.save();

    res.status(200).json({ message: "Report marked as reviewed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
