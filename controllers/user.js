const User = require("../model/user.js");

//signup
module.exports.rendersignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signupUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    //automatic redirect after signup
    req.login(registerUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "welcome to BlissfulWander");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//login
module.exports.renderlogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "welcome to the BlissfulWander");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl); //redirect saved current api-path
};

//logout
module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "you are logout now!");
    res.redirect("/listings");
  });
};
