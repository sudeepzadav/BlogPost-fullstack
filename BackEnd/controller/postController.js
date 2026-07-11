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
    const creator = req.user;
    const image = req.file;
    const findUser = await User.findById(creator);
    if (!findUser) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    const { secure_url, public_id } = await uploadImage(image.path);
    fs.unlinkSync(image.path);
    const postId =
      title.toLowerCase().split(" ").join("-") + "-" + randomUUID();
    const newPost = await Post.create({
      title,
      description,
      draft,
      creator,
      postId,
      image: secure_url,
      imageId: public_id,
    });
    await User.findByIdAndUpdate(creator, { $push: { posts: newPost._id } });
    return res.status(201).json({
      success: true,
      message: "Post create successfully",
      post: newPost,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
async function getPost(req, res) {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;
    const posts = await Post.find({ draft: false })
      .populate({
        path: "creator",
        select: "name",
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const totalPost = await Post.countDocuments({ draft: false });
    return res.status(200).json({
      success: true,
      message: "Posts get successfully",
      posts: posts,
      hasMore: skip + limit < totalPost,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
async function getPostId(req, res) {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ postId, draft: false })
      .populate({
        path: "creator",
        select: "name email",
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name email",
        },
      });
    return res.status(200).json({
      success: true,
      message: "Post get successfully",
      post: post,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function updatePost(req, res) {
  try {
    const { postId } = req.params;
    const { title, description, draft } = req.body;
    const creator = req.user;
    const image = req.file;
    const postdata = await Post.findOne({ postId });
    if (creator != postdata.creator) {
      return res.status(400).json({
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
    postdata.draft = draft || postdata.draft;
    postdata.save();

    return res.status(200).json({
      success: true,
      message: "Post update successfully",
      post: postdata,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function postLike(req, res) {
  try {
    const creator = req.user;
    const { postId } = req.params;
    const post = await Post.findOne({ postId });
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post Not found" });
    }
    if (!post.likes.includes(creator)) {
      await Post.findOneAndUpdate({ postId }, { $push: { likes: creator } });
      await User.findByIdAndUpdate(creator, { $push: { postlikes: post._id } });
      return res
        .status(200)
        .json({ success: true, message: "Post Liked Successfully" });
    } else {
      await Post.findOneAndUpdate({ postId }, { $pull: { likes: creator } });
      await User.findByIdAndUpdate(creator, { $pull: { postlikes: post._id } });
      return res
        .status(200)
        .json({ success: true, message: "Post Un-Liked Successfully" });
    }
  } catch (error) {
    return handleError(res, error);
  }
}

async function deletePost(req, res) {
  try {
    const creator = req.user;
    const { postId } = req.params;
    const post = await Post.findOne({ postId });
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    if (!(creator == post.creator))
      return res.status(403).json({
        success: false,
        message: "You are not authorized for this action",
      });
    await deleteImage(post.imageId);

    await Post.findOneAndDelete({ postId });
    await User.findByIdAndUpdate(creator, { $pull: { blogs: post._id } });
    return res
      .status(200)
      .json({ success: true, message: "deleted Sucessfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: error.message,
    });
  }
}

async function searchPosts(req, res) {
  try {
    const { search, page, limit } = req.query;
    const skip = (page - 1) * limit;
    const query = {
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
module.exports = {
  postLike,
  createPost,
  getPost,
  getPostId,
  updatePost,
  deletePost,
  searchPosts,
};
