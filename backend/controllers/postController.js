const Post = require("../models/postModel");

exports.createPost = async (req, res) => {
  try {
    const { title, body, pic } = req.body;
    // console.log(title, body, pic);
    if (!title || !body || !pic) {
      return res.status(422).json({
        success: false,
        error: "Please add all the fields",
      });
    }

    const user = req.user;
    user.password = undefined;

    const post = new Post({
      title,
      body,
      photo: pic,
      postedBy: user,
    });

    await post.save();
    return res.status(200).json({
      success: true,
      post,
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err.message,
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name");

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err.message,
    });
  }
};

exports.getMyPost = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "_id name"
    );

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err.message,
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    );
    return res.json({
      result,
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err.message,
    });
  }
};

exports.unLikePost = async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    );
    return res.json({
      result,
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err.message,
    });
  }
};

exports.commentPost = async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.user._id,
    };
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name");

    return res.json({
      result,
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId }).populate(
      "postedBy",
      "_id name"
    );
    if (!post) {
      return res.status(422).json({
        message: "post not found",
      });
    }
    const result = await post.remove();
    res.json({
      result,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getSubPosts = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: { $in: req.user.following } })
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name");

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err.message,
    });
  }
};
