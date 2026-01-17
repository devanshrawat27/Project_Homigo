const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { isLogin, isowner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");

// ✅ Listing model import (for search suggestions)
const Listing = require("../models/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

/* =========================================================
   ✅ SEARCH SUGGESTIONS ROUTE (Navbar dropdown)
   URL: /listings/search/suggestions?q=deh
========================================================= */
router.get(
  "/search/suggestions",
  wrapAsync(async (req, res) => {
    const q = (req.query.q || "").trim();

    if (!q) return res.json([]);

    let searchConditions = [];

    // Check if query contains comma (full location format)
    if (q.includes(',')) {
      const parts = q.split(',').map(part => part.trim());
      const locationPart = parts[0];
      const countryPart = parts[1];

      // Search for location and country separately
      if (locationPart) {
        searchConditions.push({ location: { $regex: locationPart, $options: "i" } });
      }
      if (countryPart) {
        searchConditions.push({ country: { $regex: countryPart, $options: "i" } });
      }
    } else {
      // Regular search across location and country
      searchConditions.push({ location: { $regex: q, $options: "i" } });
      searchConditions.push({ country: { $regex: q, $options: "i" } });
    }

    // Find matching listings
    const listings = await Listing.find({
      $or: searchConditions,
    })
      .limit(8)
      .select("location country");

    // unique suggestions
    const suggestions = [];
    const set = new Set();

    for (let l of listings) {
      const place = `${l.location}, ${l.country}`;
      if (!set.has(place)) {
        set.add(place);
        suggestions.push(place);
      }
    }

    res.json(suggestions);
  })
);

/* =========================================================
   ✅ MAIN ROUTES
========================================================= */

// ✅ HOME LISTINGS + CREATE LISTING
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLogin,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createlisting)
  );

// ✅ NEW FORM
router.get("/new", isLogin, listingController.newRenderform);

// ✅ SHOW / UPDATE / DELETE
router
  .route("/:id")
  .get(wrapAsync(listingController.showlisting))
  .put(
    isLogin,
    isowner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updatelisting)
  )
  .delete(isLogin, isowner, wrapAsync(listingController.deletelisting));

// ✅ EDIT FORM
router.get("/:id/edit", isLogin, isowner, wrapAsync(listingController.editlisting));

module.exports = router;
