const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/download/:lessonId", (req, res) => {
    console.log(req.params)
  const filePath = path.join(__dirname, `../uploads/courses/${req.params.lessonId}/original.mp4`);
   console.log("File path:", filePath);
  res.download(filePath, "podcast.mp4", (err) => {
    if (err) {
      console.error("Download error:", err);
      return res.status(404).send("File not found");
    }
  });
});

module.exports = router;
