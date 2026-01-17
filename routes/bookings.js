const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { isLogin } = require("../middleware.js");
const bookingController = require("../controller/booking.js");
const Booking = require("../models/booking.js");  // Added for booked dates route

// Get booked dates for a listing
router.get("/listings/:id/booked-dates", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const bookings = await Booking.find({ listing: id, status: 'approved' });
  const bookedDates = [];
  bookings.forEach(booking => {
    // Generate array of dates between checkIn and checkOut
    let current = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);
    while (current < end) {
      bookedDates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
  });
  res.json(bookedDates);  // Return array of booked date strings (YYYY-MM-DD)
}));

// Create booking
router.post("/:id/book", isLogin, wrapAsync(bookingController.createBooking));

// My bookings
router.get("/my", isLogin, wrapAsync(bookingController.myBookings));

// Host bookings (bookings on my listings)
router.get("/host", isLogin, wrapAsync(bookingController.hostBookings));

// Cancel booking
router.delete("/:id", isLogin, wrapAsync(bookingController.cancelBooking));

// Approve booking
router.post("/:id/approve", isLogin, wrapAsync(bookingController.approveBooking));

// Reject booking
router.post("/:id/reject", isLogin, wrapAsync(bookingController.rejectBooking));

module.exports = router;