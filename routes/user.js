const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../model/user.js');
const wrapAsync = require('../utils/WrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware/middleware');

//singup
router.get('/singUp', (req, res) => {
  res.render('users/singup.ejs');
});

router.post(
  '/singUp',
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', 'welcome to BlissfulWander');
        res.redirect('/listings');
      });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/singUp');
    }
  }),
);

//loging
router.get('/login', (req, res) => {
  res.render('users/login.ejs');
});

router.post(
  '/login',
  saveRedirectUrl, //after login redirect access path
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash('success', 'wellcome to the BlissfulWander');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
  },
);

//logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash('success', 'you are loggout now!');
    res.redirect('/listings');
  });
});
module.exports = router;
