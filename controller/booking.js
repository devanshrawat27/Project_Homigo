const mongoose = require("mongoose");
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

/* ===========================
   ✅ CREATE BOOKING
=========================== */
module.exports.createBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, guests, totalPrice } = req.body;

    // Validate totalPrice
    const parsedTotalPrice = parseFloat(totalPrice);
    if (isNaN(parsedTotalPrice) || parsedTotalPrice <= 0) {
      req.flash("error", "Invalid total price. Please try booking again.");
      return req.session.save(() => res.redirect(`/listings/${id}`));
    }

    // Validate listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return req.session.save(() => res.redirect("/listings"));
    }

    // Check if user is not the owner
    if (listing.owner.equals(req.user._id)) {
      req.flash("error", "You cannot book your own listing!");
      return req.session.save(() => res.redirect(`/listings/${id}`));
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      req.flash("error", "Check-in date cannot be in the past!");
      return req.session.save(() => res.redirect(`/listings/${id}`));
    }

    if (checkOutDate <= checkInDate) {
      req.flash("error", "Check-out date must be after check-in date!");
      return req.session.save(() => res.redirect(`/listings/${id}`));
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      listing: id,
      $or: [
        {
          $and: [
            { checkIn: { $lte: checkInDate } },
            { checkOut: { $gt: checkInDate } },
          ],
        },
        {
          $and: [
            { checkIn: { $lt: checkOutDate } },
            { checkOut: { $gte: checkOutDate } },
          ],
        },
        {
          $and: [
            { checkIn: { $gte: checkInDate } },
            { checkOut: { $lte: checkOutDate } },
          ],
        },
      ],
    });

    if (overlappingBooking) {
      req.flash(
        "error",
        "This listing is not available for the selected dates!"
      );
      return req.session.save(() => res.redirect(`/listings/${id}`));
    }

    // Create booking
    const booking = new Booking({
      listing: id,
      user: req.user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: parseInt(guests),
      totalPrice: parsedTotalPrice,
      status: "pending",
    });

    await booking.save();

    req.flash("success", "Booking sent successfully!");
    return req.session.save(() => res.redirect("/bookings/my"));
  } catch (err) {
    console.log("❌ Create Booking Error:", err);
    req.flash("error", "Something went wrong while creating booking!");
    return req.session.save(() => res.redirect(`/listings/${req.params.id}`));
  }
};

/* ===========================
   ✅ MY BOOKINGS
=========================== */
module.exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing")
      .sort({ createdAt: -1 });

    res.render("bookings/my", { bookings });
  } catch (err) {
    console.log("❌ My Bookings Error:", err);
    req.flash("error", "Unable to load your bookings!");
    return req.session.save(() => res.redirect("/listings"));
  }
};

/* ===========================
   ✅ HOST BOOKINGS
=========================== */
module.exports.hostBookings = async (req, res) => {
  try {
    const userListings = await Listing.find({ owner: req.user._id }).select(
      "_id"
    );

    const bookings = await Booking.find({
      listing: { $in: userListings.map((listing) => listing._id) },
    })
      .populate("listing")
      .populate("user")
      .sort({ createdAt: -1 });

    res.render("bookings/host", { bookings });
  } catch (err) {
    console.log("❌ Host Bookings Error:", err);
    req.flash("error", "Unable to load host bookings!");
    return req.session.save(() => res.redirect("/listings"));
  }
};

/* ===========================
   ✅ CANCEL BOOKING
=========================== */
module.exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      req.flash("error", "Booking not found!");
      return req.session.save(() => res.redirect("/bookings/my"));
    }

    // Check if user owns this booking
    if (!booking.user.equals(req.user._id)) {
      req.flash("error", "You don't have permission to cancel this booking!");
      return req.session.save(() => res.redirect("/bookings/my"));
    }

    // Check if booking is in the future (can't cancel past bookings)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (booking.checkIn <= today) {
      req.flash("error", "Cannot cancel bookings that have already started!");
      return req.session.save(() => res.redirect("/bookings/my"));
    }

    booking.status = "cancelled";
    await booking.save();

    req.flash("success", "Booking cancelled successfully!");
    return req.session.save(() => res.redirect("/bookings/my"));
  } catch (err) {
    console.log("❌ Cancel Booking Error:", err);
    req.flash("error", "Something went wrong while cancelling booking!");
    return req.session.save(() => res.redirect("/bookings/my"));
  }
};

/* ===========================
   ✅ APPROVE BOOKING
=========================== */
module.exports.approveBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("listing");
    if (!booking) {
      req.flash("error", "Booking not found!");
      return req.session.save(() => res.redirect("/bookings/host"));
    }

    // Check if user owns the listing
    if (!booking.listing.owner.equals(req.user._id)) {
      req.flash("error", "You don't have permission to approve this booking!");
      return req.session.save(() => res.redirect("/bookings/host"));
    }

    // Check if already processed
    if (booking.status !== "pending") {
      req.flash("error", "Booking has already been processed!");
      return req.session.save(() => res.redirect("/bookings/host"));
    }

    // Check for overlapping approved bookings
    const overlappingApproved = await Booking.findOne({
      listing: booking.listing._id,
      status: "approved",
      $or: [
        {
          $and: [
            { checkIn: { $lte: booking.checkIn } },
            { checkOut: { $gt: booking.checkIn } },
          ],
        },
        {
          $and: [
            { checkIn: { $lt: booking.checkOut } },
            { checkOut: { $gte: booking.checkOut } },
          ],
        },
        {
          $and: [
            { checkIn: { $gte: booking.checkIn } },
            { checkOut: { $lte: booking.checkOut } },
          ],
        },
      ],
    });

    if (overlappingApproved) {
      req.flash(
        "error",
        "Cannot approve: Dates conflict with an existing approved booking!"
      );
      return req.session.save(() => res.redirect("/bookings/host"));
    }

    booking.status = "approved";
    await booking.save();

    req.flash("success", "Booking approved successfully!");
    return req.session.save(() => res.redirect("/bookings/host"));
  } catch (err) {
    console.log("❌ Approve Booking Error:", err);
    req.flash("error", "Something went wrong while approving booking!");
    return req.session.save(() => res.redirect("/bookings/host"));
  }
};

/* ===========================
   ✅ REJECT BOOKING
=========================== */
module.exports.rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("listing");
    if (!booking) {
      req.flash("error", "Booking not found!");
      return req.session.save(() => res.redirect("/bookings/host"));
    }

    // Check if user owns the listing
    if (!booking.listing.owner.equals(req.user._id)) {
      req.flash("error", "You don't have permission to reject this booking!");
      return req.session.save(() => res.redirect("/bookings/host"));
    }

    // Check if already processed
    if (booking.status !== "pending") {
      req.flash("error", "Booking has already been processed!");
      return req.session.save(() => res.redirect("/bookings/host"));
    }

    booking.status = "rejected";
    await booking.save();

    req.flash("success", "Booking rejected successfully!");
    return req.session.save(() => res.redirect("/bookings/host"));
  } catch (err) {
    console.log("❌ Reject Booking Error:", err);
    req.flash("error", "Something went wrong while rejecting booking!");
    return req.session.save(() => res.redirect("/bookings/host"));
  }
};
