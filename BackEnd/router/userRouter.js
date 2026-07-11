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
const route = express.Router();
route.post("/signup", createUser);
route.post("/signin", loginUser);
route.get("/", getUser);
route.get("/verify-email/:verificationToken", verifyToken);
route.post("/forgot-password", forgotPassword);
route.post("/reset-password/:resetToken", resetPassword);
route.get("/:id", getUserId);
route.put("/:id", updateUser);
route.delete("/:id", deleteUser);
module.exports = route;