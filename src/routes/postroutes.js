const express = require('express');
const multer = require("multer");
const authMiddleware = require('../middleware/auth.middleware');

const { postcontroller , feedcontroller , updatePostController , deletePostController} = require('../controller/postcontroller');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post("/create-post", authMiddleware, upload.single("image"), postcontroller); 
router.patch("/update-post/:id", authMiddleware, upload.single("image"), updatePostController);
router.get('/feed', authMiddleware, feedcontroller);
router.delete('/delete-post/:id', authMiddleware, deletePostController);
module.exports = router;