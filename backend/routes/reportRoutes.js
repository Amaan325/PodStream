const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const verifyUser = require("../utils/verifyUser");

router.post("/report/:podcastId", verifyUser, reportController.createReport);
router.get("/reports", verifyUser, reportController.getReports);
router.get("/reports/:podcastId", verifyUser, reportController.getReportsByPodcast);
router.patch("/reports/resolve/:reportId", verifyUser, reportController.resolveReport);
router.patch("/reports/review/:reportId", verifyUser, reportController.reviewReport);

// ✅ Delete all reports for a podcast (e.g., when admin deletes the podcast)
router.delete("/delete/:podcastId", verifyUser, reportController.deleteReportsByPodcast);

module.exports = router;
