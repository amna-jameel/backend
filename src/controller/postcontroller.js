
const postModel = require("../models/post.model");
const uplaodFile = require("../services/storage.services");
const Like = require("../models/like.model");
const Comment = require("../models/comment.model");

// =====================================================
// CREATE POST
// =====================================================

async function postcontroller(req, res) {
  try {
    console.log(req.body);
    console.log(req.file);

    const result = await uplaodFile(req.file.buffer);

    const post = await postModel.create({
      image: result.url,
      caption: req.body.caption,
      user: req.user.id,
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to create post",
    });
  }
}

// =====================================================
// ADD COMMENT
// =====================================================

const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      text: text.trim(),
      user: userId,
      post: postId,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name username profilePicture");

    return res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.log("COMMENT ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// GET COMMENTS
// =====================================================

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({
      post: postId,
    })
      .populate("user", "name username profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.log("GET COMMENTS ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// FEED
// =====================================================

async function feedcontroller(req, res) {
  try {
    const posts = await postModel
      .find()
      .sort({ updatedAt: -1 })
      .populate("user", "name username profilePicture");

    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likes = await Like.find({
          post: post._id,
        }).select("user");

        return {
          ...post.toObject(),
          likes,
        };
      })
    );

    return res.status(200).json({
      message: "Posts fetched successfully",
      posts: postsWithLikes,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
}

// =====================================================
// UPDATE POST
// =====================================================

async function updatePostController(req, res) {
  try {
    const { id } = req.params;

    const updateData = {
      caption: req.body.caption,
    };

    if (req.file) {
      const result = await uplaodFile(req.file.buffer);
      updateData.image = result.url;
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to update post",
    });
  }
}

// =====================================================
// DELETE POST
// =====================================================

async function deletePostController(req, res) {
  try {
    const { id } = req.params;

    await postModel.findByIdAndDelete(id);

    // Delete likes associated with this post
    await Like.deleteMany({
      post: id,
    });

    // Delete comments associated with this post
    await Comment.deleteMany({
      post: id,
    });

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to delete post",
    });
  }
}

// =====================================================
// GET SINGLE POST
// =====================================================

async function getsinglePostController(req, res) {
  try {
    const { id } = req.params;

    const post = await postModel
      .findById(id)
      .populate("user", "name username profilePicture");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const likes = await Like.find({
      post: id,
    }).select("user");

    return res.status(200).json({
      message: "Post fetched successfully",
      post: {
        ...post.toObject(),
        likes,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch post",
    });
  }
}

// =====================================================
// LIKE / UNLIKE POST
// =====================================================

const toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const existingLike = await Like.findOne({
      user: userId,
      post: postId,
    });

    // UNLIKE
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);

      const likesCount = await Like.countDocuments({
        post: postId,
      });

      return res.status(200).json({
        message: "Post unliked",
        liked: false,
        likesCount,
      });
    }

    // LIKE
    await Like.create({
      user: userId,
      post: postId,
    });

    const likesCount = await Like.countDocuments({
      post: postId,
    });

    return res.status(201).json({
      message: "Post liked",
      liked: true,
      likesCount,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  toggleLike,
  postcontroller,
  feedcontroller,
  updatePostController,
  deletePostController,
  getsinglePostController,
  addComment,
  getComments,
};
