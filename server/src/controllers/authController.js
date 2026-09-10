const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

const updateProfile = async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Name is required"
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name.trim()
    },
    {
      new: true,
      runValidators: true
    }
  ).select("-password");

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user
  });
};

const changePassword = async (req, res) => {
  const {
    currentPassword,
    newPassword
  } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message:
        "Current password and new password are required"
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message:
        "New password must be at least 8 characters"
    });
  }

  const user = await User.findById(
    req.user._id
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  const passwordMatches =
    await bcrypt.compare(
      currentPassword,
      user.password
    );

  if (!passwordMatches) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect"
    });
  }

  user.password = await bcrypt.hash(
    newPassword,
    12
  );

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully"
  });
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  changePassword
};
