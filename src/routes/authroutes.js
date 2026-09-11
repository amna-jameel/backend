
const express = require("express");
const multer = require("multer");

const authMiddleware = require("../middleware/auth.middleware");

const upload = multer({
  storage: multer.memoryStorage(),
});

const {
  registerUser,
  loginUser,
  updateProfile,
  deleteAccount,
  getMe,
} = require("../controller/authcontroller");

const router = express.Router();

// =========================
// REGISTER
// =========================
router.post("/register", registerUser);

// =========================
// LOGIN
// =========================
router.post("/login", loginUser);

// =========================
// GET CURRENT USER
// =========================
router.get(
  "/me",
  authMiddleware,
  getMe
);

// =========================
// UPDATE PROFILE
// =========================
router.patch(
  "/update-profile",
  authMiddleware,
  upload.single("profilePicture"),
  updateProfile
);

// =========================
// DELETE ACCOUNT
// =========================
router.delete(
  "/delete-account",
  authMiddleware,
  deleteAccount
);

module.exports = router;