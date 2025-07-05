const express = require("express");
const {
  signUp,
  signIn,
  auth,
  update,
  deleteUser,
  signOut,
  verifyOtpAndRegister,
  subscribeUser,
  unsubscribeUser,
  checkSubscription,
  getSubscribersCount,
  togglePodcastLike,
  getLikedPodcasts,
} = require("../controllers/userController");
const router = express.Router();
const verifyUser = require("../utils/verifyUser");

router.route("/signup").post(signUp);
router.route("/signup/otp").post(verifyOtpAndRegister);
router.route("/signin").post(signIn);
router.route("/google-login").post(auth);
router.put("/update/:_id", verifyUser, update);
router.delete("/delete/:_id", verifyUser, deleteUser);
router.get("/signout", signOut);

// New routes for subscription feature
router.get("/check-subscription/:targetUserId", verifyUser, checkSubscription);
router.get("/subscribers-count/:userId", getSubscribersCount);
router.put("/subscribe/:targetUserId", verifyUser, subscribeUser);
router.put("/unsubscribe/:targetUserId", verifyUser, unsubscribeUser);
router.put("/like-podcast/:id", verifyUser, togglePodcastLike);
// routes/userRoutes.js
router.get("/liked-podcasts", verifyUser, getLikedPodcasts);

module.exports = router;
