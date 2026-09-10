const express = require('express');
const multer = require("multer");
const authMiddleware = require('../middleware/auth.middleware');

const { toggleLike, postcontroller , feedcontroller , updatePostController , deletePostController , getsinglePostController , addComment , getComments} = require('../controller/postcontroller');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post("/create-post", authMiddleware, upload.single("image"), postcontroller); 
router.patch("/update-post/:id", authMiddleware, upload.single("image"), updatePostController);
router.get('/feed', authMiddleware, feedcontroller);
router.get('/post/:id', authMiddleware, getsinglePostController);
router.delete('/delete-post/:id', authMiddleware, deletePostController);
router.post("/like/:postId", authMiddleware, toggleLike);
router.post(
  "/comment/:postId",
  authMiddleware,
  addComment
);

router.get("/comments/:postId", authMiddleware, getComments);
module.exports = router;