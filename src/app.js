const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();
const upload = multer({storage : multer.memoryStorage()});
const uplaodFile = require("./services/storage.services");
app.use(express.json());
app.use(cors());
const postModel = require("./models/post.model");
// post api 
app.post('/create-post' , upload.single("image") , async (req , res)=>{
    console.log(req.body);
    console.log(req.file)
    const result = await uplaodFile(req.file.buffer);
    const post = await postModel.create({
        image : result.url ,
        caption : req.body.caption
    })
    return res.status(201).json({
        message :"post created successfully" ,
        post
    })
})
// get api 
app.get('/feed-post' , async(req , res)=> {
const posts = await postModel.find();
return res.status(200) . json({
    message : " posts fetched successfully",
    posts
})
})
// single post get 
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;

  const post = await postModel.findById(id);

  res.json({
    post,
  });
});
// update api 
// update api
app.patch("/update-post/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      caption: req.body.caption,
    };

    // New image selected
    if (req.file) {
      const result = await uplaodFile(req.file.buffer);

      updateData.image = result.url;
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update post",
    });
  }
});
// delete post
app.delete("/delete-post/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await postModel.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      message: "Post deleted successfully",
      post: deletedPost,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to delete post",
    });
  }
});
module.exports=app;