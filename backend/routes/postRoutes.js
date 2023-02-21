const express = require("express");
const {
  createPost,
  getPosts,
  getMyPost,
  likePost,
  unLikePost,
  commentPost,
  deletePost,
  getSubPosts,
} = require("../controllers/postController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/createpost").post(isAuthenticatedUser, createPost);
router.route("/allposts").get(isAuthenticatedUser, getPosts);
router.route("/myposts").get(isAuthenticatedUser, getMyPost);
router.route("/like").put(isAuthenticatedUser, likePost);
router.route("/unlike").put(isAuthenticatedUser, unLikePost);
router.route("/comment").put(isAuthenticatedUser, commentPost);
router.route("/deletepost/:postId").delete(isAuthenticatedUser, deletePost);
router.route("/getsubposts").get(isAuthenticatedUser, getSubPosts);

module.exports = router;
