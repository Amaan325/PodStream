const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error");
const nodemailer = require("nodemailer");
require("dotenv").config();

let otpStore = {};
const signUp = async (req, res, next) => {
  console.log(req.body);
  try {
    const { username, email, password } = req.body;

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    let otp = Math.floor(1000 + Math.random() * 9000); // Ensure OTP is always 4 digits
    otpStore[email] = { otp, username, password };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your OTP for Ajion",
      text: `Your OTP is: ${otp}`, // Plain text version of the email
      html: `
        <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Verify Your PODSTREAM Account</h1>
    <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
            <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
            <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${otp}</h1>
        </div>
        <div style="padding: 30px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Thank you for creating a PODSTREAM account. To activate your account, please enter the following verification code:</p>
            <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #854CE6;">${otp}</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the PODSTREAM app to activate your account.</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not create a PODSTREAM account, please disregard this email.</p>
        </div>
    </div>
    <br>
    <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The Podstream Team</p>
</div>
        `,
    });

    console.log("OTP sent to", email);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error during SignUp:", error);
    if (error.response) {
      console.error("SMTP Error Response:", error.response);
    }
    next(error);
  }
};

const verifyOtpAndRegister = async (req, res, next) => {
  const { email, otp } = req.body;

  // Check if OTP matches
  if (otpStore[email] && otpStore[email].otp == otp) {
    // Hash the password
    const hashPassword = await bcrypt.hash(otpStore[email].password, 10);

    // Create the user
    const validUser = new User({
      username: otpStore[email].username,
      email: email,
      password: hashPassword,
    });

    await validUser.save();

    // Clear OTP store after successful registration
    delete otpStore[email];

    res
      .status(200)
      .json({ message: "User Registered Successfully", user: validUser });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
};
const signIn = async (req, res, next) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const isPasswordValid = bcrypt.compareSync(password, validUser.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, "Invalid Credentials"));
    }

    validUser.password = undefined;
    const token = jwt.sign({ validUser }, process.env.SECRET_KEY, {
      expiresIn: "20h", // JWT expiration
    });

    // Set the cookie with options to make it persistent
    res
      .cookie("access_token", token, {
        httpOnly: true, // Helps prevent XSS
        secure: process.env.NODE_ENV === "production", // Set to true in production
        maxAge: 20 * 60 * 60 * 1000, // 20 hours in milliseconds
      })
      .status(200)
      .json({ message: "User Logged In", user: validUser });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


const auth = async (req, res, next) => {
  const { email, displayName, photoUrl } = req.body;
  try {
    const validUser = await User.findOne({ email });

    if (validUser) {
      console.log("User found:", validUser);
      validUser.password = undefined;

      const token = jwt.sign({ validUser }, process.env.SECRET_KEY, {
        expiresIn: "20h",
      });
      res
        .cookie("access_token", token)
        .status(200)
        .json({ message: "User Logged In", user: validUser });
    } else {
      console.log("User not found, creating a new user");
      const userName = displayName.split(" ").join("").toLowerCase();
      const generatedPassword = await bcrypt.hash(
        Math.random().toString(36).slice(-8),
        10
      ); // Use async

      const newUser = new User({
        email,
        username: userName,
        profilePicture: photoUrl,
        password: generatedPassword,
      });

      await newUser.save();
      newUser.password = undefined;
      const token = jwt.sign({ newUser }, process.env.SECRET_KEY, {
        expiresIn: "20h",
      });

      res
        .cookie("access_token", token)
        .status(200)
        .json({ message: "User Registered", user: newUser });
    }
  } catch (error) {
    console.error("Error in auth controller:", error);
    next(error);
  }
};

const update = async (req, res, next) => {
  if (req.user._id != req.params._id) {
    return next(errorHandler(403, "You can only update your account"));
  }

  try {
    const updateData = {
      username: req.body.username,
      profilePicture: req.body.profilePicture,
      email: req.body.email,
    };

    // Only update password if provided
    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params._id },
      { $set: updateData },
      { new: true }
    );

    updatedUser.password = undefined;
    return res.status(200).json({ message: "User Updated", user: updatedUser });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  if (req.user._id != req.params._id) {
    return next(errorHandler(403, "You can only delete your account"));
  }

  try {
    const isDeleted = await User.findOneAndDelete({ _id: req.params._id });
    if (isDeleted) {
      res.clearCookie("access_token");
      return res.status(200).json({ message: "User Deleted Successfully" }); // Return a success response
    } else {
      return next(errorHandler(404, "User Not Found"));
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const signOut = async (req, res, next) => {
  res.clearCookie("access_token").status(200).json({ message: "Signed out" });
};

module.exports = {
  signUp,
  signIn,
  auth,
  update,
  deleteUser,
  signOut,
  verifyOtpAndRegister,
};
