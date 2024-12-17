const User = require('../model/user.js');
//singup
module.exports.renderSingUp = (req, res) => {
  res.render('users/singup.ejs');
};

module.exports.singUpUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    // console.log(registerUser);
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
};

//login

module.exports.renderlogin = (req, res) => {
  res.render('users/login.ejs');
};

module.exports.loginUser = async (req, res) => {
  req.flash('success', 'wellcome to the BlissfulWander');
  let redirectUrl = res.locals.redirectUrl || '/listings';
  res.redirect(redirectUrl);
};

//logout
module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash('success', 'you are loggout now!');
    res.redirect('/listings');
  });
};
