const express = require("express");
const {
  createPost,
  getPost,
  getPostId,
  updatePost,
  postLike,
  deletePost,
  searchPosts,
} = require("../controller/postController");
const verifyUser = require("../middleware/auth");
const upload = require("../utils/multer");
const {
  addCommentPost,
  commentPostLike,
  updateCommentPost,
  deleteCommentPost,
} = require("../controller/comentController");

const route = express.Router();
route.post("/", verifyUser, upload.single("image"), createPost);
route.get("/", getPost);
route.get("/search-post", searchPosts);
route.post("/like/:postId", verifyUser, postLike);
route.post("/comment/:postId", verifyUser, addCommentPost);
route.post("/comment-like/:commentId", verifyUser, commentPostLike);
route.put("/comment/:commentId", verifyUser, updateCommentPost);
route.delete("/comment/:commentId", verifyUser, deleteCommentPost);
route.get("/:postId", getPostId);
route.put("/:postId", verifyUser, upload.single("image"), updatePost);
route.delete("/:postId", verifyUser, deletePost);

module.exports = route;