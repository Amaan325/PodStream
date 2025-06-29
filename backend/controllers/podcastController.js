const Podcast = require("../models/podcastModel");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const User = require("../models/userModel");
const { getIO } = require("../socket");

exports.uploadPodcast = async (req, res) => {
  console.log("Starting podcast upload");
  try {
    const { title, description, tags, category } = req.body;
    const video = req.files?.videoFile[0];
    const thumbnail = req.files?.thumbnail[0];
    const uploaderId = req.user?.validUser?._id || req.params.userId;

    if (!video || !thumbnail || !uploaderId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    console.log("Files received, starting processing");

    const thumbnailFilename = `${uuidv4()}_${thumbnail.originalname}`;
    const videoFilename = `${uuidv4()}_${video.originalname}`;

    const thumbnailDir = path.join(__dirname, "../uploads/thumbnails");
    const tempDir = path.join(__dirname, "../uploads/temp");
    [thumbnailDir, tempDir].forEach((dir) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);
    const tempVideoPath = path.join(tempDir, videoFilename);

    await Promise.all([
      fs.promises.writeFile(thumbnailPath, thumbnail.buffer),
      fs.promises.writeFile(tempVideoPath, video.buffer),
    ]);

    console.log("Files saved, starting HLS conversion");

    const lessonId = uuidv4();
    const outputPath = path.join(__dirname, "../uploads/courses", lessonId);
    fs.mkdirSync(outputPath, { recursive: true });

    const ffmpegArgs = [
      "-i",
      tempVideoPath,
      "-codec:v",
      "libx264",
      "-codec:a",
      "aac",
      "-hls_time",
      "10",
      "-hls_playlist_type",
      "vod",
      "-hls_segment_filename",
      path.join(outputPath, "segment%03d.ts"),
      path.join(outputPath, "index.m3u8"),
    ];

    console.log("Executing FFmpeg with args:", ffmpegArgs);
    const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

    ffmpegProcess.stderr.on("data", (data) => {
      const output = data.toString();
      const match = output.match(/time=(\d+:\d+:\d+\.\d+)/);
      if (match && match[1]) {
        console.log("Internal processing update:", match[1]);
      }
    });

    ffmpegProcess.on("close", async (code) => {
      try {
        const originalMp4Path = path.join(outputPath, "original.mp4");
        fs.copyFile(tempVideoPath, originalMp4Path, (err) => {
          if (err) {
            console.error("Error saving original video:", err);
          } else {
            console.log("Original video saved for download.");
          }

          fs.unlink(tempVideoPath, () => {});
        });

        if (code !== 0) {
          console.error("FFmpeg failed with code", code);
          return;
        }

        console.log("HLS conversion complete, saving to database");

        const newPodcast = await Podcast.create({
          title,
          description,
          tags:
            typeof tags === "string"
              ? tags.split(",").map((t) => t.trim())
              : [],
          category,
          thumbnail: `./uploads/thumbnails/${thumbnailFilename}`,
          videoUrl: `./uploads/courses/${lessonId}/index.m3u8`,
          downloadUrl: `./uploads/courses/${lessonId}/original.mp4`,
          uploader: uploaderId,
        });

        console.log("Podcast created successfully");

        // 🔔 Emit notifications to subscribers after successful upload
        const uploader = await User.findById(uploaderId);
        const subscribers = await User.find(
          { subscribedUsers: uploaderId },
          "_id username email"
        );

        if (subscribers.length) {
          const io = getIO();
          subscribers.forEach((subscriber) => {
            io.to(subscriber._id.toString()).emit("newPodcastFromSubscribed", {
              message: `🎧 ${uploader.username} uploaded a new podcast!`,
              uploaderId,
              uploaderName: uploader.username,
            });
          });
        }

        res.status(200).json({
          success: true,
          message: "Podcast uploaded and processed successfully",
          podcastId: newPodcast._id,
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({
          success: false,
          message: "Database error",
          error: dbError.message,
        });
      }
    });

    ffmpegProcess.on("error", (err) => {
      console.error("FFmpeg process error:", err);
      fs.unlink(tempVideoPath, () => {});
      res.status(500).json({
        success: false,
        message: "Video processing failed",
        error: err.message,
      });
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};

exports.getAllPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find().populate(
      "uploader",
      "username email"
    );
    res.status(200).json(podcasts);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve podcasts", error });
  }
};

exports.getUserPodcasts = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const podcasts = await Podcast.find({ uploader: userId });
    res.status(200).json(podcasts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve user's podcasts", error });
  }
};

exports.searchPodcasts = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const podcasts = await Podcast.find({
      title: { $regex: q, $options: "i" },
    }).populate("uploader", "username");

    res.status(200).json(podcasts);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Failed to search podcasts", error });
  }
};

exports.deletePodcast = async (req, res) => {
  console.log("Deleting podcast with ID:", req.params.uploadId);
  try {
    const podcastId = req.params.uploadId;
    const podcast = await Podcast.findById(podcastId);

    if (!podcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    if (
      podcast.uploader.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    fs.rmSync(path.dirname(podcast.videoUrl), { recursive: true, force: true });

    if (fs.existsSync(podcast.thumbnail)) {
      fs.unlinkSync(podcast.thumbnail);
    }

    await podcast.deleteOne();
    res.status(200).json({ message: "Podcast deleted successfully" });
  } catch (error) {
    console.error("Error deleting podcast:", error);
    res.status(500).json({ message: "Failed to delete podcast", error });
  }
};
