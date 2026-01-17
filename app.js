// ===================== ENV SETUP =====================
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ===================== IMPORTS =====================
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/expressError.js");

const session = require("express-session");

// ✅ connect-mongo latest fix for Node v22 (default export issue)
let MongoStore = require("connect-mongo");
MongoStore = MongoStore.default || MongoStore;

const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// ✅ Routers
const listingRoutes = require("./routes/listings.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/users.js");
const bookingRoutes = require("./routes/bookings.js");

// ===================== MIDDLEWARE & SETTINGS =====================
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ===================== DATABASE =====================
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("✅ MongoDB Connected");

    // ===================== SESSION STORE =====================
    const store = MongoStore.create({
      mongoUrl: dbUrl,
      crypto: {
        secret: process.env.SECRET ,
      },
      touchAfter: 24 * 60 * 60, // 24 hours
    });

    store.on("error", (e) => {
      console.log("❌ SESSION STORE ERROR:", e);
    });

    const sessionOptions = {
      store,
      name: "homigoSession",
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ maxAge (correct spelling)
        secure: false, // ✅ for localhost dev
        sameSite: 'lax' // ✅ for localhost dev
      },
    };

    app.use(session(sessionOptions));
    app.use(flash());

    // ===================== PASSPORT CONFIG =====================
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // ===================== LOCALS (FLASH + CURRENT USER) =====================
    app.use((req, res, next) => {
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      res.locals.currentUser = req.user;
      next();
    });

    // ===================== ROUTES =====================
    app.use("/listings", listingRoutes);
    app.use("/listings/:id/reviews", reviewRoutes);
    app.use("/", userRoutes);
    app.use("/bookings", bookingRoutes);

    // ===================== 404 HANDLER =====================
    app.all("*", (req, res, next) => {
      next(new ExpressError(404, "Page not found"));
    });

    // ===================== ERROR HANDLER =====================
    app.use((err, req, res, next) => {
      const { statusCode = 500, message = "Something went wrong!" } = err;
      res.status(statusCode).render("listings/error.ejs", { message });
    });

    // ===================== START SERVER =====================
    const port = process.env.PORT || 8081;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

async function main() {
  await mongoose.connect(dbUrl);
}
