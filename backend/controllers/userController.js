const bcryptjs = require("bcryptjs");

const User = require("../models/userModel");
const Post = require("../models/postModel");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({
        success: false,
        error: "Please Enter all the details",
      });
    }

    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(422).json({
        success: false,
        error: "User already exists with email",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      pic,
    });

    await newUser.save();

    res.json({
      success: true,
      message: "successfully saved",
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    res.json({
      success: true,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        success: false,
        error: "Please enter all the details",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Incorrect Username or Password",
      });
    }

    const isMatched = await user.comparePassword(password);

    if (!isMatched) {
      return res.status(404).json({
        success: false,
        error: "Incorrect Username or Password",
      });
    }

    const { _id, name, followers, following, pic } = user;
    const token = user.getJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: { _id, name, email, followers, following, pic },
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const posts = await Post.find({ postedBy: req.params.id }).populate(
      "postedBy",
      "_id name"
    );

    return res.json({
      user,
      posts,
    });
  } catch (err) {
    return res.status(422).json({
      err,
    });
  }
};

exports.followUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.body.followId,
      {
        $push: { followers: req.user._id },
      },
      { new: true }
    );

    const result = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.followId },
      },
      { new: true }
    ).select("-password");

    return res.json({ result });
  } catch (err) {
    console.log(err);
  }
};

exports.unFollowUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    );

    const result = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.unfollowId },
      },
      { new: true }
    ).select("-password");

    return res.json({ result });
  } catch (err) {
    console.log(err);
  }
};

exports.updateProfilePic = async (req, res) => {
  try {
    // console.log(req.body.pic);
    const result = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { pic: req.body.pic },
      },
      { new: true }
    );

    res.json({
      result,
    });
  } catch (err) {
    res.status(422).json({ message: "pic cannot post" });
  }
};
