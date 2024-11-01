const Podcast = require("../models/podcastModel");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

// Upload podcast with HLS conversion using FFmpeg
exports.uploadPodcast = async (req, res) => {
  try {
    const { title, description, tags, category } = req.body;
    const thumbnailPath = req.files["thumbnail"][0].path;
    const videoPath = req.files["videoFile"][0].path;

    // Unique identifier for the HLS segments and playlist
    const lessonId = uuidv4();
    const outputPath = `./uploads/courses/${lessonId}`;
    const hlsPath = `${outputPath}/index.m3u8`;

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // FFmpeg command for HLS conversion
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

    exec(ffmpegCommand, async (error, stdout, stderr) => {
      if (error) {
        console.error("FFmpeg error:", error);
        return res.status(500).json({ message: "Error during video processing" });
      }

      const newPodcast = new Podcast({
        title,
        description,
        tags: tags.split(",").map((tag) => tag.trim()),
        category,
        thumbnail: thumbnailPath,
        videoUrl: hlsPath,
        uploader: req.user._id, // Ensure user authentication middleware provides this
      });

      await newPodcast.save();
      res.status(201).json({ message: "Podcast uploaded successfully", podcast: newPodcast });
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload podcast", error });
  }
};

// Get all podcasts
exports.getAllPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find().populate("uploader", "username email");
    res.status(200).json(podcasts);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve podcasts", error });
  }
};

// Get podcasts by specific user
exports.getUserPodcasts = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is provided by auth middleware
    const podcasts = await Podcast.find({ uploader: userId });
    res.status(200).json(podcasts);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve user's podcasts", error });
  }
};

// Delete podcast
exports.deletePodcast = async (req, res) => {
  try {
    const podcastId = req.params.id;
    const podcast = await Podcast.findById(podcastId);

    if (!podcast) return res.status(404).json({ message: "Podcast not found" });

    if (podcast.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Remove files
    fs.rmdirSync(path.dirname(podcast.videoUrl), { recursive: true });
    fs.unlinkSync(podcast.thumbnail);

    await podcast.remove();
    res.status(200).json({ message: "Podcast deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete podcast", error });
  }
};
