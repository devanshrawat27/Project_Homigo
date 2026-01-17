const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

/* ===========================
   ✅ INDEX (WITH SEARCH FILTER)
=========================== */
module.exports.index = async (req, res) => {
  let { search } = req.query;
  let listings;

  try {
    if (search && search.trim() !== "") {
      search = search.trim();
      let searchConditions = [];

      if (search.includes(",")) {
        const parts = search.split(",").map((part) => part.trim());
        const locationPart = parts[0];
        const countryPart = parts[1];

        if (locationPart) {
          searchConditions.push({
            location: { $regex: locationPart, $options: "i" },
          });
        }
        if (countryPart) {
          searchConditions.push({
            country: { $regex: countryPart, $options: "i" },
          });
        }
      } else {
        searchConditions.push({ location: { $regex: search, $options: "i" } });
        searchConditions.push({ country: { $regex: search, $options: "i" } });
        searchConditions.push({ title: { $regex: search, $options: "i" } });
      }

      listings = await Listing.find({ $or: searchConditions });
    } else {
      listings = await Listing.find({});
    }

    res.render("listings/index", { listings, search });
  } catch (err) {
    console.log("❌ Index error:", err);
    req.flash("error", "Something went wrong while loading listings!");
    return req.session.save(() => res.redirect("/listings"));
  }
};

/* ===========================
   ✅ NEW FORM
=========================== */
module.exports.newRenderform = (req, res) => {
  res.render("listings/new");
};

/* ===========================
   ✅ SHOW LISTING
=========================== */
module.exports.showlisting = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Invalid Listing ID!");
      return req.session.save(() => res.redirect("/listings"));
    }

    const list = await Listing.findById(id).populate("owner");

    if (!list) {
      req.flash("error", "Listing not found!");
      return req.session.save(() => res.redirect("/listings"));
    }

    list.reviews = list.reviews.filter((reviewId) =>
      mongoose.Types.ObjectId.isValid(reviewId)
    );

    await list.populate({
      path: "reviews",
      populate: { path: "author" },
    });

    res.render("listings/show", { list });
  } catch (err) {
    console.log("❌ Show listing error:", err);
    req.flash("error", "Something went wrong while loading listing!");
    return req.session.save(() => res.redirect("/listings"));
  }
};

/* ===========================
   ✅ CREATE LISTING
=========================== */
module.exports.createlisting = async (req, res) => {
  try {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    const newListing = new Listing(req.validListing);
    newListing.owner = req.user._id;

    if (response.body.features.length > 0) {
      newListing.geometry = response.body.features[0].geometry;
    }

    await newListing.save();

    req.flash("success", "Successfully created a new listing!");
    return req.session.save(() => {
      res.redirect(`/listings/${newListing._id}`);
    });
  } catch (err) {
    console.log("❌ Create listing error:", err);
    req.flash("error", "Something went wrong while creating listing!");
    return req.session.save(() => res.redirect("/listings"));
  }
};

/* ===========================
   ✅ EDIT LISTING
=========================== */
module.exports.editlisting = async (req, res) => {
  const { id } = req.params;

  try {
    const editList = await Listing.findById(id);

    if (!editList) {
      req.flash("error", "Listing not found!");
      return req.session.save(() => res.redirect("/listings"));
    }

    let original = editList.image.url;
    original = original.replace("/upload", "/upload/h_300,w_200");

    res.render("listings/edit", { listing: editList, original });
  } catch (err) {
    console.log("❌ Edit listing error:", err);
    req.flash("error", "Something went wrong while opening edit page!");
    return req.session.save(() => res.redirect("/listings"));
  }
};

/* ===========================
   ✅ UPDATE LISTING
=========================== */
module.exports.updatelisting = async (req, res) => {
  const { id } = req.params;

  try {
    let updateData = { ...req.validListing };

    // ✅ Update geometry if location changed
    if (req.body.listing.location) {
      let response = await geocodingClient
        .forwardGeocode({
          query: req.body.listing.location,
          limit: 1,
        })
        .send();

      if (response.body.features.length > 0) {
        updateData.geometry = response.body.features[0].geometry;
      }
    }

    // ✅ If no new image uploaded keep old one
    if (!req.file) {
      const existingListing = await Listing.findById(id);
      if (existingListing) updateData.image = existingListing.image;
    }

    await Listing.findByIdAndUpdate(id, updateData, {
      runValidators: true,
    });

    req.flash("success", "Successfully updated the listing!");
    return req.session.save(() => {
      res.redirect(`/listings/${id}`);
    });
  } catch (err) {
    console.log("❌ Update listing error:", err);
    req.flash("error", "Something went wrong while updating listing!");
    return req.session.save(() => res.redirect(`/listings/${id}`));
  }
};

/* ===========================
   ✅ DELETE LISTING
=========================== */
module.exports.deletelisting = async (req, res) => {
  const { id } = req.params;

  try {
    // ✅ cascading delete
    await Booking.deleteMany({ listing: id });
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing and all related bookings deleted!");
    return req.session.save(() => {
      res.redirect("/listings");
    });
  } catch (err) {
    console.log("❌ Delete listing error:", err);
    req.flash("error", "Something went wrong while deleting listing!");
    return req.session.save(() => res.redirect("/listings"));
  }
};
