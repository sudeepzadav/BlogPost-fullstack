const mongoose = require("mongoose");

const userSchma = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],
    postlikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
const User = mongoose.model("user", userSchma);
module.exports = User;