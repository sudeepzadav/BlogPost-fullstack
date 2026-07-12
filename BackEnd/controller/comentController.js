  const handleError = require("../utils/handleError");
  const Post = require("../model/postSchema");
  const Comment = require("../model/comentSchema");

  async function addCommentPost(req, res) {
    try {
      const creator = req.user;
      const { postId } = req.params;
      const { comment, parentComment } = req.body; // 👈 parentComment added
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

      // if replying, make sure the parent comment actually exists on this post
      if (parentComment) {
        const parent = await Comment.findById(parentComment);
        if (!parent) {
          return res
            .status(404)
            .json({ success: false, message: "Comment being replied to not found" });
        }
      }

      const createComment = await Comment.create({
        message: comment,
        post: postId,
        user: creator,
        parentComment: parentComment || null, // 👈 added
      });

      // populate user so the frontend has name/avatar right away
      await createComment.populate("user", "name email");

      // only push top-level comments onto the post; replies live under their parent
      if (!parentComment) {
        await Post.findByIdAndUpdate(postId, {
          $push: { comments: createComment._id },
        });
      }

      return res.status(201).json({
        success: true,
        message: parentComment ? "Reply added successfully" : "Comment added successfully",
        createComment,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  // 👇 new controller — GET replies for a comment
  async function getCommentReplies(req, res) {
    try {
      const { commentId } = req.params;

      const parent = await Comment.findById(commentId);
      if (!parent) {
        return res
          .status(404)
          .json({ success: false, message: "Comment Not found" });
      }

      const replies = await Comment.find({ parentComment: commentId })
        .populate("user", "name email")
        .sort({ createdAt: 1 });

      return res.status(200).json({
        success: true,
        message: "Replies fetched successfully",
        replies,
      });
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

  // update comment / delete comment

  async function updateCommentPost(req, res) {
    try {
      const creator = req.user;
      const { message } = req.body;
      const { commentId } = req.params;

      if (!message) {
        return res
          .status(400)
          .json({ success: false, message: "Please enter the comment message" });
      }

      const existingComment = await Comment.findById(commentId);
      if (!existingComment) {
        return res
          .status(404)
          .json({ success: false, message: "Comment Not found" });
      }

      if (existingComment.user.toString() !== creator.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to edit this comment",
        });
      }

      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { message },
        { new: true }
      ).populate("user", "name email");

      return res.status(200).json({
        success: true,
        message: "Comment update successfully",
        updatedComment,
      });
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

      const post = await Post.findById(existingComment.post);

      if (
        existingComment.user.toString() !== creator.toString() &&
        post?.creator?.toString() !== creator.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this comment",
        });
      }

      // only top-level comments live in post.comments — replies don't need this pull
      if (!existingComment.parentComment) {
        await Post.findByIdAndUpdate(existingComment.post, {
          $pull: { comments: commentId },
        });
      }

      // if it's a top-level comment, clean up all its replies too
      await Comment.deleteMany({ parentComment: commentId });

      await Comment.findByIdAndDelete(commentId);

      return res.status(200).json({
        success: true,
        message: "Comment delete successfully",
        commentId,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  module.exports = {
    addCommentPost,
    getCommentReplies, // 👈 new export
    commentPostLike,
    updateCommentPost,
    deleteCommentPost,
  };