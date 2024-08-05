const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");

async function registerUser(request, response) {
  try {
    const { name, email, password, profile_pic } = request.body;

    // Check if user with the given email already exists
    const checkEmail = await UserModel.findOne({ email });
    if (checkEmail) {
      return response.status(403).json({
        message: "User already exists",
        error: true,
      });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashpassword = await bcryptjs.hash(password, salt);

    // Create the user payload
    const payload = {
      name,
      email,
      profile_pic,
      password: hashpassword,
    };

    // Save the user to the database
    const user = new UserModel(payload);
    const userSave = await user.save();

    return response.status(201).json({
      message: "User created successfully",
      data: userSave,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = registerUser;
