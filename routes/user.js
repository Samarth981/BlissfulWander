const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../model/user.js');
const wrapAsync = require('../utils/WrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware/middleware');

const userControllre = require('../controllers/user.js');

//singup
router
  .route('/singUp')
  .get(userControllre.renderSingUp)
  .post(wrapAsync(userControllre.singUpUser));

//loging
router
  .route('/login')
  .get(userControllre.renderlogin)
  .post(
    saveRedirectUrl, //after login redirect access path
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    userControllre.loginUser,
  );

//logout
router.get('/logout', userControllre.logoutUser);

module.exports = router;
