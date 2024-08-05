const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function checkPassword(request, response) {
  try {
    const { password, userId } = request.body;

    // Find user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
      });
    }

    // Verify password
    const verifyPassword = await bcryptjs.compare(password, user.password);
    if (!verifyPassword) {
      return response.status(400).json({
        message: "Invalid password",
        error: true,
      });
    }

    // Generate JWT token
    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d", // Token expires in 1 hour
    });

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    };

    // Send response with token in cookie
    return response.cookie("token", token, cookieOptions).status(200).json({
      message: "Login successful",
      success: true,
      token: token,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = checkPassword;
