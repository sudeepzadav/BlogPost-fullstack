const express = require("express");
const {
  getUser,
  createUser,
  getUserId,
  updateUser,
  loginUser,
  deleteUser,
  verifyToken,
  forgotPassword,
  resetPassword,
} = require("../controller/userController");

const verifyUser = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const route = express.Router();

// Public
route.post("/signup", createUser);
route.post("/signin", loginUser);
route.get("/verify-email/:verificationToken", verifyToken);
route.post("/forgot-password", forgotPassword);
route.post("/reset-password/:resetToken", resetPassword);

// Admin only
route.get("/", verifyUser, isAdmin, getUser);

// Logged in — self or admin, checked inside controller
route.get("/:id", verifyUser, getUserId);
route.put("/:id", verifyUser, updateUser);
route.delete("/:id", verifyUser, deleteUser);

module.exports = route;