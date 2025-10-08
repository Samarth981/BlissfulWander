const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/middleware");

const userController = require("../controllers/user.js");

//signup
router
  .route("/signup")
  .get(userController.rendersignup)
  .post(wrapAsync(userController.signupUser));

//logging
router
  .route("/login")
  .get(userController.renderlogin)
  .post(
    saveRedirectUrl, //when login first save current api-path
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginUser //call back
  );

//logout
router.get("/logout", userController.logoutUser);

module.exports = router;
