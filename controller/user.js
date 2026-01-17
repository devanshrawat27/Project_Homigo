const User = require("../models/user.js");

//signup form
module.exports.renderSignupform = (req, res) => {
  res.render("users/signup.ejs");
};

//signup logic
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Homigo!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// login form
module.exports.renderLoginform = (req, res) => {
  res.render("users/login.ejs");
};

//login logic
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};
