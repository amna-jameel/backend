const userModel = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uplaodFile = require("../services/storage.services");
const router = express.Router();
async function  registerUser(req, res){
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const user = new userModel({
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword,
        confirmPassword : hashedPassword
    });
    if (req.body.password.length < 6) {
    return res.status(400).json({
        message: "Minimum password length should be 6"
    });
}
if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
        message: "Password and confirm password do not match"
    });
}
    await user.save();
  res.status(200).json({
    message: "user registered successfully"
});
    
}
async function loginUser(req, res) {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.status(200).json({
        message: "Login successful"
    });
}
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

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password -confirmPassword");

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
module.exports = {registerUser, loginUser, updateProfile};