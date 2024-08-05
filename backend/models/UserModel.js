const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide name"],
    },

    email: {
      type: String,
      required: [true, "Provide email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Provide password"],
      unique: true,
    },
    profile_pic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);
module.exports=UserModel
