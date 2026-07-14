const User = require("../model/userSchema");
const { generateJWT, verifyJWT } = require("../utils/generateTokens");
const handleError = require("../utils/handleError");
const bcrypt = require("bcrypt");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/sendEmail");

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    const checkForexitUser = await User.findOne({ email });
    if (checkForexitUser) {
      if (checkForexitUser.verify) {
        return res.status(400).json({
          success: false,
          message: "User already registered with this email",
        });
      } else {
        let token = await generateJWT({
          email: checkForexitUser.email,
          id: checkForexitUser._id,
        });
        await sendVerificationEmail(checkForexitUser.email, token);
        return res.status(201).json({
          success: true,
          message: "Please Check Your Email",
        });
      }
    }
    const newpassword = await bcrypt.hash(password, 10);
    // role is never taken from req.body — always defaults to "user" from the schema
    const newUser = await User.create({ name, email, password: newpassword });
    let token = await generateJWT({
      email: newUser.email,
      id: newUser._id,
    });
    await sendVerificationEmail(newUser.email, token);
    return res.status(201).json({
      success: true,
      message: "Please Check Your Email",
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function getUser(req, res) {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      message: "User get successfully",
      users: users,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function getUserId(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "User get successfully",
      user,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body; // role intentionally not destructured

    // self-or-admin check
    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this account" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User update successfully",
      user,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    const checkForexitUser = await User.findOne({ email });
    if (!checkForexitUser) {
      return res.status(400).json({
        success: false,
        message: "Not register",
      });
    }
    if (!checkForexitUser.verify) {
      let token = await generateJWT({
        email: checkForexitUser.email,
        id: checkForexitUser._id,
      });
      await sendVerificationEmail(checkForexitUser.email, token);
      return res.status(403).json({
        success: false,
        message: "Please Check Your Email",
      });
    }
    const checkPassword = await bcrypt.compare(
      password,
      checkForexitUser.password,
    );
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate",
      });
    }
    let token = await generateJWT({
      email: checkForexitUser.email,
      id: checkForexitUser._id,
      role: checkForexitUser.role, // required for isAdmin to work
    });
    return res.status(200).json({
      success: true,
      message: "User Login successfully",
      user: {
        id: checkForexitUser._id,
        name: checkForexitUser.name,
        email: checkForexitUser.email,
        role: checkForexitUser.role,
        token,
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // self-or-admin check
    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this account" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully " });
  } catch (error) {
    return handleError(res, error);
  }
}

async function verifyToken(req, res) {
  try {
    const { verificationToken } = req.params;
    const verifyToken = await verifyJWT(verificationToken);
    if (!verifyToken) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Token/Email expired" });
    }
    const { id } = verifyToken;
    const user = await User.findByIdAndUpdate(
      id,
      { verify: true },
      { new: true },
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Users Not found" });
    }
    return res.status(200).json({ success: true, message: "Email Verified" });
  } catch (error) {
    return handleError(res, error);
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const resetToken = await generateJWT({ id: user._id, email: user.email });
    await sendResetPasswordEmail(user.email, resetToken);
    return res.status(200).json({
      success: true,
      message: "Please Check Your Email",
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function resetPassword(req, res) {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;
    if (!newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }
    const decoded = await verifyJWT(resetToken);
    if (!decoded) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expried token" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateUser = await User.findByIdAndUpdate(
      decoded.id,
      { password: hashedPassword },
      { new: true },
    );
    if (!updateUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  createUser,
  getUser,
  getUserId,
  updateUser,
  loginUser,
  deleteUser,
  verifyToken,
  forgotPassword,
  resetPassword,
};