import user from "../models/user.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // 🔴 validation
    if (!name || !email || !password || !role) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    // 🔴 check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // ✅ create user
    const newUser = await User.create({
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser
    });

  } catch (error) {
    next(error);
  }
};
//// loin controller
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Email and password required", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // 🔥 GENERATE TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    ///// generate refresh token

    const refreshToken = jwt.sign({id:user._id},process.env.JWT_REFRESH_SECRET,{expiresIn:"7d"})
    user.refreshToken = refreshToken;
    await user.save()

    // 🔐 REMOVE PASSWORD
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      refreshToken
    });

  } catch (error) {
    next(error);
  }
};

/////  refresh token controller 
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return next(new ErrorHandler("Refresh token required", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    // 🔹 3. 🔥 CHECK USER + STORED TOKEN (YOUR CODE HERE)
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return next(new ErrorHandler("Invalid refresh token", 401));
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      success: true,
      token: newAccessToken
    });

  } catch (error) {
    return next(new ErrorHandler("Invalid Refresh Token", 401));
  }
};

////create logout api

export const logoutUser = async (req, res, next) => {
  try {
    // 🔍 get user from middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // 🔥 remove refresh token
    user.refreshToken = null;

    // 💾 save changes
    await user.save();

    // 📤 response
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    next(error);
  }
};