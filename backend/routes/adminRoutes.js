const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const verifyUser = require("../utils/verifyUser");
const isAdmin = require("../utils/isAdmin");

// GET all reports
router.get("/reports", verifyUser, isAdmin, adminController.getAllReports);

// DELETE a podcast
router.delete("/podcast/:id", verifyUser, isAdmin, adminController.deletePodcast);

// Change report status
router.patch("/report/review/:id", verifyUser, isAdmin, adminController.markReportReviewed);
router.patch("/report/resolve/:id", verifyUser, isAdmin, adminController.markReportResolved);

module.exports = router;
