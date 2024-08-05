const express = require("express");
const registerUser = require("../controller/registerUser");
const checkEmail = require("../controller/checkEmail");
const logout = require("../controller/logout");

const checkPassword = require("../controller/checkPassword");
const userDetails = require("../controller/userDetails");
const updateUserDetails = require("../controller/updateUserDetails");
const searchUser = require("../controller/searchUser");
const router = express.Router();

router.post("/register", registerUser);
//checkemail// for login step one
router.post("/email", checkEmail);
//check password//step two
router.post("/password", checkPassword);
//get user details
router.get("/user-details", userDetails);
//logout
router.get("/logout", logout);
//update
router.post("/update", updateUserDetails);
//search user
router.post("/search", searchUser);



module.exports = router;
