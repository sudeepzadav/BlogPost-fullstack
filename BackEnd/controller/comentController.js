const handleError = require("../utils/handleError");
const Post = require("../model/postSchema");
const Comment = require("../model/comentSchema");

async function addCommentPost(req, res) {
  try {
    const creator = req.user;
    const { postId } = req.params;
    const { comment } = req.body;
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Please enter the comment message" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not Found" });
    }
    const createComment = await Comment.create({
      message: comment,
      post: postId,
      user: creator,
    });
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: createComment._id },
    });
    return res
      .status(201)
      .json({ success: true, message: "Comment added successfully" });
  } catch (error) {
    return handleError(res, error);
  }
}

async function commentPostLike(req, res) {
  try {
    const creator = req.user;
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment Not found" });
    }
    if (!comment.likes.includes(creator)) {
      await Comment.findByIdAndUpdate(commentId, { $push: { likes: creator } });
      return res
        .status(200)
        .json({ success: true, message: "Comment Liked Successfully" });
    } else {
      await Comment.findByIdAndUpdate(commentId, { $pull: { likes: creator } });

      return res
        .status(200)
        .json({ success: true, message: "Comment Un-Liked Successfully" });
    }
  } catch (error) {
    return handleError(res, error);
  }
}
// update comment /delete comment

async function updateCommentPost(req, res) {
  try {
    const creator = req.user;
    const { message } = req.body;
    const { commentId } = req.params;
    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment Not found" });
    }
    if (existingComment.user != creator) {
      return res.status(403).json({
        success: false,
        message: "Your are not validate user to edit this comment",
      });
    }
    await Comment.findByIdAndUpdate(commentId, { message }, { new: true });
    return res
      .status(200)
      .json({ success: true, message: "Comment update successfully" });
  } catch (error) {
    return handleError(res, error);
  }
}

async function deleteCommentPost(req, res) {
  try {
    const creator = req.user;
    const { commentId } = req.params;
    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment Not found" });
    }
    if (
      existingComment.user != creator &&
      existingComment.post.creator != creator
    ) {
      return res.status(403).json({
        success: false,
        message: "Your are not validate user to edit this comment",
      });
    }
    await Post.findByIdAndUpdate(existingComment.post._id, {
      $pull: { comments: commentId },
    });
    await Comment.findByIdAndDelete(commentId);
    return res
      .status(200)
      .json({ success: true, message: "Comment delete successfully" });
  } catch (error) {
    return handleError(res, error);
  }
}
module.exports = {
  addCommentPost,
  commentPostLike,
  updateCommentPost,
  deleteCommentPost,
};