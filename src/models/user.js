const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    confirmPassword: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      trim: true,
      default: "Postly User",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;