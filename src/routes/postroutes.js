const express = require('express');
const multer = require("multer");

const { postcontroller , feedcontroller , updatePostController , deletePostController} = require('../controller/postcontroller');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post("/create-post", upload.single("image"), postcontroller); 
router.patch("/update-post/:id", upload.single("image"), updatePostController);
router.get('/feed',  feedcontroller);
router.delete('/delete-post/:id', deletePostController);
module.exports = router;