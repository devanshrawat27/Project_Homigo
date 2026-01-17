const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

const { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controller/user.js");

// ✅ SIGNUP ROUTES
router
  .route("/signup")
  .get(usercontroller.renderSignupform)
  .post(wrapAsync(usercontroller.signup));

// ✅ LOGIN ROUTES
router
  .route("/login")
  .get(usercontroller.renderLoginform)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    usercontroller.login
  );

// ✅ LOGOUT ROUTE
router.post("/logout", usercontroller.logout);

module.exports = router;
