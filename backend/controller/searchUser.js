const UserModel = require("../models/UserModel");

async function searchUser(request, response) {
  try {
    const { search } = request.body;
    if (!search) {
      return response.status(400).json({
        message: "Search term is required",
        success: false,
      });
    }
    const query = new RegExp(search, "i");
    const users = await UserModel.find({
      $or: [{ name: query }, { email: query }],
    }).select("-password");
    
    return response.json({
      message: "All users",
      data: users,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
}

module.exports = searchUser;
