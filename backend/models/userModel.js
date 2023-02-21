const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please enter valid Email"],
  },
  password: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default: "https://www.computerhope.com/jargon/g/guest-user.jpg",
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    const isMatched = await bcryptjs.compare(enteredPassword, this.password);
    return isMatched;
  } catch (err) {
    return res.json({
      success: false,
      error: err.message,
    });
  }
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
