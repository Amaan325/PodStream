const express = require("express");
const {
  signUp,
  signIn,
  auth,
  update,
  deleteUser,
  signOut,
  verifyOtpAndRegister
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

module.exports = router;
