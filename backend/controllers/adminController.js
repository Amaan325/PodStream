const Report = require("../models/reportModel");
const Podcast = require("../models/podcastModel");

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("userId", "username")
      .populate("podcastId", "title thumbnailUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deletePodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findByIdAndDelete(req.params.id);
    if (!podcast) return res.status(404).json({ message: "Podcast not found" });

    await Report.deleteMany({ podcastId: req.params.id });
    res.status(200).json({ message: "Podcast and related reports deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.markReportReviewed = async (req, res) => {
  try {
    const updated = await Report.findByIdAndUpdate(req.params.id, { status: "Reviewed" });
    if (!updated) return res.status(404).json({ message: "Report not found" });

    res.status(200).json({ message: "Marked as reviewed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.markReportResolved = async (req, res) => {
  try {
    const updated = await Report.findByIdAndUpdate(req.params.id, { status: "Resolved" });
    if (!updated) return res.status(404).json({ message: "Report not found" });

    res.status(200).json({ message: "Marked as resolved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
