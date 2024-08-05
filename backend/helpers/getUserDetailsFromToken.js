const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const getUserDetailsFromToken = async (token) => {
  try {
    if (!token) {
      return {
        message: "Session out",
        logout: true,
      };
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) {
      return {
        message: "User not found",
        error: true,
      };
    }

    return user;
  } catch (error) {
    return {
      message: error.message || "Invalid or expired token",
      error: true,
    };
  }
};

module.exports = getUserDetailsFromToken;
