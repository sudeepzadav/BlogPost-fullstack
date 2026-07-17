const Post = require("../model/postSchema");
const User = require("../model/userSchema");
const handleError = require("../utils/handleError");
const { uploadImage, deleteImage } = require("../utils/uploadImage");
const ShortUniqueId = require("short-unique-id");
const { randomUUID } = new ShortUniqueId({ length: 20 });
const fs = require("fs");

async function createPost(req, res) {
  try {
    const { title, description, draft } = req.body;
    const creatorId = req.user.id;
    const image = req.file;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const findUser = await User.findById(creatorId);
    if (!findUser) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    const { secure_url, public_id } = await uploadImage(image.path);
    fs.unlinkSync(image.path);
    const postId =
      title.toLowerCase().split(" ").join("-") + "-" + randomUUID();

    const isDraft = draft === "true" || draft === true;

    const newPost = await Post.create({
      title,
      description,
      draft: isDraft,
      creator: creatorId,
      status: "pending",
      postId,
      image: secure_url,
      imageId: public_id,
    });

    await User.findByIdAndUpdate(creatorId, { $push: { posts: newPost._id } });

    return res.status(201).json({
      success: true,
      message: isDraft
        ? "Draft saved successfully"
        : "Post created successfully, pending admin approval",
      post: newPost,
    });
  } catch (error) {
    console.error("createPost error:", error);
    return handleError(res, error);
  }
}

async function getPost(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ status: "approved", draft: false })
      .populate({ path: "creator", select: "name" })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPost = await Post.countDocuments({ status: "approved", draft: false });

    return res.status(200).json({
      success: true,
      message: "Posts get successfully",
      posts,
      hasMore: skip + limit < totalPost,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function getPostId(req, res) {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ postId, status: "approved" })
      .populate({ path: "creator", select: "name email" })
      .populate({
        path: "comments",
        populate: { path: "user", select: "name email" },
      });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Post get successfully",
      post,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function updatePost(req, res) {
  try {
    const { postId } = req.params;
    const { title, description, draft } = req.body;
    const userId = req.user.id;
    const image = req.file;

    const postdata = await Post.findOne({ postId });
    if (!postdata) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (postdata.creator.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized for this action",
      });
    }

    if (image) {
      await deleteImage(postdata.imageId);
      const { secure_url, public_id } = await uploadImage(image.path);
      postdata.image = secure_url;
      postdata.imageId = public_id;
      fs.unlinkSync(image.path);
    }

    postdata.title = title || postdata.title;
    postdata.description = description || postdata.description;

    if (draft !== undefined) {
      postdata.draft = draft === "true" || draft === true;
    }

    // re-editing a live post sends it back for review (common blog behavior) —
    // remove this line if you'd rather edits stay live without re-approval
    if (postdata.status === "approved") {
      postdata.status = "pending";
    }

    await postdata.save();

    return res.status(200).json({
      success: true,
      message: "Post update successfully",
      post: postdata,
    });
  } catch (error) {
    console.error("updatePost error:", error);
    return handleError(res, error);
  }
}

// user — fetch their own post (any status) for editing
async function getPostForEdit(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findOne({ postId });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.creator.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this post",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function postLike(req, res) {
  try {
    const userId = req.user.id;
    const { postId } = req.params;
    const post = await Post.findOne({ postId });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post Not found" });
    }

    if (!post.likes.includes(userId)) {
      await Post.findOneAndUpdate({ postId }, { $push: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $push: { postlikes: post._id } });
      return res.status(200).json({ success: true, message: "Post Liked Successfully" });
    } else {
      await Post.findOneAndUpdate({ postId }, { $pull: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { postlikes: post._id } });
      return res.status(200).json({ success: true, message: "Post Un-Liked Successfully" });
    }
  } catch (error) {
    return handleError(res, error);
  }
}

async function deletePost(req, res) {
  try {
    const userId = req.user.id;
    const { postId } = req.params;
    const post = await Post.findOne({ postId });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.creator.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized for this action",
      });
    }

    await deleteImage(post.imageId);
    await Post.findOneAndDelete({ postId });
    await User.findByIdAndUpdate(post.creator, { $pull: { posts: post._id } });

    return res.status(200).json({ success: true, message: "deleted Sucessfully" });
  } catch (error) {
    return handleError(res, error);
  }
}

async function searchPosts(req, res) {
  try {
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      status: "approved",
      draft: false,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    const totalPosts = await Post.countDocuments(query);
    if (totalPosts === 0) {
      return res.status(400).json({
        success: false,
        message: "Make sure all words are spelled correctly",
      });
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: `Found ${posts.length} result for ${search}`,
      posts,
      totalPosts,
      hasMore: skip + posts.length < totalPosts,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// admin — view all pending posts awaiting approval
async function getPendingPosts(req, res) {
  try {
    const posts = await Post.find({ status: "pending", draft: false })
      .populate({ path: "creator", select: "name email" })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Pending posts fetched successfully",
      posts,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// admin — approve or reject a post
async function updatePostStatus(req, res) {
  try {
    const { postId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const post = await Post.findByIdAndUpdate(postId, { status }, { new: true });
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Post ${status} successfully`,
      post,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function getMyPosts(req, res) {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ creator: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Your posts fetched successfully",
      posts,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// user — view only their own drafts
async function getMyDrafts(req, res) {
  try {
    const userId = req.user.id;
    const drafts = await Post.find({ creator: userId, draft: true }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Drafts fetched successfully",
      posts: drafts,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  postLike,
  createPost,
  getPost,
  getPostId,
  updatePost,
  deletePost,
  searchPosts,
  getPendingPosts,
  updatePostStatus,
  getMyPosts,
  getMyDrafts,
  getPostForEdit,
};