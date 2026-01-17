const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");

const listingSchema = require("../schema.js");
const {validateReview, isLogin,isAuthor}=require("../middleware.js");

const reviewController=require("../controller/review.js");
// ================= ROUTES =================

// ✅ Create Review
router.post(
  "/",
  isLogin,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// ✅ Delete Review
router.delete(
  "/:reviewId",
  isLogin,
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
