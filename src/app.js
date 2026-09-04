const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}));
app.use(express.urlencoded({ extended: true }));
const authroutes = require("./routes/authroutes");
const postroutes = require("./routes/postroutes");
const feedcontroller = require("./controller/postcontroller");
app.use("/api/user", authroutes);
app.use("/api/posts", postroutes);
const postModel = require("./models/post.model");
module.exports = app;