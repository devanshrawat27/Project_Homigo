const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/reviews");

// ✅ Create Review (POST)
module.exports.createReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Listing exist check
    const listingItem = await Listing.findById(id);
    if (!listingItem) {
      req.flash("error", "Listing not found!");
      return req.session.save(() => res.redirect("/listings"));
    }

    // Logged-in user check (safety)
    if (!req.user) {
      req.flash("error", "You must be logged in to add a review!");
      return req.session.save(() => res.redirect(`/listings/${id}`));
    }

    // Review create
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    await newReview.save();

    // Push review into listing
    listingItem.reviews.push(newReview._id);
    await listingItem.save();

    req.flash("success", "Successfully created a new review!");

    // ✅ IMPORTANT: session save then redirect (flash fix)
    return req.session.save(() => {
      res.redirect(`/listings/${id}`);
    });
  } catch (err) {
    console.log("❌ Error creating review:", err);
    req.flash("error", "Something went wrong while creating review!");

    return req.session.save(() => {
      res.redirect(`/listings/${req.params.id}`);
    });
  }
};

// ✅ Delete Review (DELETE)
module.exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    // listing exist check
    const listingItem = await Listing.findById(id);
    if (!listingItem) {
      req.flash("error", "Listing not found!");
      return req.session.save(() => res.redirect("/listings"));
    }

    // Remove review ref from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete review
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Successfully deleted the review!");

    // ✅ IMPORTANT: session save then redirect (flash fix)
    return req.session.save(() => {
      res.redirect(`/listings/${id}`);
    });
  } catch (err) {
    console.log("❌ Error deleting review:", err);
    req.flash("error", "Something went wrong while deleting review!");

    return req.session.save(() => {
      res.redirect(`/listings/${req.params.id}`);
    });
  }
};
