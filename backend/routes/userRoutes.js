const express = require("express");
const {
  loginUser,
  registerUser,
  getUsers,
  getUser,
  followUser,
  unFollowUser,
  updateProfilePic,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/signup").post(registerUser);
router.route("/users").get(getUsers);
router.route("/signin").post(loginUser);
router.route("/user/:id").get(isAuthenticatedUser, getUser);
router.route("/follow").put(isAuthenticatedUser, followUser);
router.route("/unfollow").put(isAuthenticatedUser, unFollowUser);
router.route("/updatepic").put(isAuthenticatedUser, updateProfilePic);

module.exports = router;
