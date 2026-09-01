const postModel = require("../models/post.model");
const uplaodFile = require("../services/storage.services");
// post create 
async function  postcontroller(req , res){
    console.log(req.body);
    console.log(req.file);

        const result = await uplaodFile(req.file.buffer);
        const post = await postModel.create({
            image : result.url ,
            caption : req.body.caption
        })
        return res.status(201).json({
            message :"post created successfully" ,
            post
        })
}
//  feed
async function feedcontroller(req , res){
    const posts = await postModel.find();
    return res.status(200) . json({
        message: "Posts fetched successfully",
        posts
    });
}
// updaTE POST
async function updatePostController(req, res) {
    const { id } = req.params;
    const updateData = {
      caption: req.body.caption,
    };
    if (req.file) {
      const result = await uplaodFile(req.file.buffer);
      updateData.image = result.url;
    }
    const updatedPost = await postModel.findByIdAndUpdate(id, updateData, { new: true });
    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost
    });
  }
//   delete post 
async function deletePostController(req, res) {
    const { id } = req.params;
    await postModel.findByIdAndDelete(id);
    return res.status(200).json({
        message: "Post deleted successfully"
    });
}
module.exports = {postcontroller, feedcontroller , updatePostController, deletePostController};