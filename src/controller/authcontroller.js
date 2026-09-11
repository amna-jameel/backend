
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uplaodFile = require("../services/storage.services");

// =========================
// REGISTER USER
// =========================
async function registerUser(req, res) {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password.length < 6) {
      return res.status(400).json({
        message: "Minimum password length should be 6",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      username,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    await user.save();

    return res.status(200).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
}

// =========================
// LOGIN USER
// =========================
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
}

// =========================
// GET CURRENT LOGGED-IN USER
// =========================
async function getMe(req, res) {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("-password -confirmPassword");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log("GET ME ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
}

// =========================
// UPDATE PROFILE
// =========================
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;

    const { name, username, bio } = req.body;

    const updateData = {
      name,
      username,
      bio,
    };

    if (req.file) {
      const result = await uplaodFile(req.file.buffer);

      updateData.profilePicture = result.url;
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      )
      .select("-password -confirmPassword");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
}

// =========================
// DELETE ACCOUNT
// =========================
async function deleteAccount(req, res) {
  try {
    const userId = req.user.id;

    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.clearCookie("token");

    return res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log("DELETE ACCOUNT ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
}

// =========================
// EXPORT
// =========================
module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  deleteAccount,
};