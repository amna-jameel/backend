const express = require('express');
const multer = require("multer");
const authMiddleware = require("../middleware/auth.middleware");
const upload = multer({
  storage: multer.memoryStorage(),
});
const {registerUser , loginUser , updateProfile} = require('../controller/authcontroller');


const router = express.Router();
router.post ('/register' , registerUser);
router.post ('/login' , loginUser);
router.patch(
  "/update-profile",
  authMiddleware,
  upload.single("profilePicture"),
  updateProfile
);
module.exports = router;