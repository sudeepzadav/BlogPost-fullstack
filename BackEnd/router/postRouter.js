const express = require("express");
const {
  createPost,
  getPost,
  getPostId,
  updatePost,
  postLike,
  deletePost,
  searchPosts,
  getPendingPosts,
  updatePostStatus,
  getMyPosts
} = require("../controller/postController");

const verifyUser = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../utils/multer");

const {
  addCommentPost,
  getCommentReplies,
  commentPostLike,
  updateCommentPost,
  deleteCommentPost,
} = require("../controller/comentController");

const route = express.Router();

route.post("/", verifyUser, upload.single("image"), createPost);
route.get("/", getPost);
route.get("/search-post", searchPosts);
route.get("/my-posts", verifyUser, getMyPosts);

route.get("/admin/pending", verifyUser, isAdmin, getPendingPosts);
route.put("/admin/:postId/status", verifyUser, isAdmin, updatePostStatus);

route.post("/like/:postId", verifyUser, postLike);

route.post("/comment/:postId", verifyUser, addCommentPost);
route.get("/comment/:commentId/replies", getCommentReplies);
route.post("/comment-like/:commentId", verifyUser, commentPostLike);
route.put("/comment/:commentId", verifyUser, updateCommentPost);
route.delete("/comment/:commentId", verifyUser, deleteCommentPost);

route.get("/:postId", getPostId);
route.put("/:postId", verifyUser, upload.single("image"), updatePost);
route.delete("/:postId", verifyUser, deletePost);

module.exports = route;
