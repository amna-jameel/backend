const postModel = require("../models/post.model");
const uplaodFile = require("../services/storage.services");

// CREATE POST
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

// FEED
async function feedcontroller(req, res) {
  try {
    const posts = await postModel
      .find()
      .populate("user", "name username");

    return res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
}

// UPDATE POST
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

// DELETE POST
async function deletePostController(req, res) {
  try {
    const { id } = req.params;

    await postModel.findByIdAndDelete(id);

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

module.exports = {
  postcontroller,
  feedcontroller,
  updatePostController,
  deletePostController,
};