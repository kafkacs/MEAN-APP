const bookingsService = require("./bookings.service");
const path = require("path");
const fs = require("fs");

//find all
exports.findAll = async (req, res) => {
  try {
    const { skip, limit } = req.query;

    if (!skip || !limit) {
      return res.status(400).json({ message: "skip and limit are required" });
    }
    const bookings = await bookingsService.findAll(req.query);
    res.json({
      frontFacingMessage: "Bookings retrieved successfully",
      data: bookings,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//find one
exports.findOne = async (req, res) => {
  try {
    const booking = await bookingsService.findOne(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      frontFacingMessage: "Booking retrieved successfully",
      data: booking[0],
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//find all bookings for a user
exports.findAllForUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const { skip, limit } = req.query;

    if (!skip || !limit) {
      return res.status(400).json({ message: "skip and limit are required" });
    }

    const bookings = await bookingsService.findAllForUser(req.query, userID);

    res.json({
      frontFacingMessage: "User's bookings retrieved successfully",
      data: bookings,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create booking
exports.create = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const relativePath = path.relative(
        path.join(__dirname, "../../"),
        req.file.path,
      );

      imageUrl =
        `${req.protocol}://${req.get("host")}` +
        "/" +
        relativePath.replace(/\\/g, "/");
    }

    const bookingData = {
      ...req.body,
      imageUrl,
    };

    const newBooking = await bookingsService.createBooking(bookingData);

    res.status(201).json({
      frontFacingMessage: "Booking created successfully",
      data: newBooking,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//update booking status
exports.update = async (req, res) => {
  try {
    const updatedBooking = await bookingsService.updateBookingStatus(
      req.params.id,
      req.body.status,
    );

    res.json({
      frontFacingMessage: "Booking updated successfully",
      data: updatedBooking,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//delete booking
exports.delete = async (req, res) => {
  try {
    const existingBooking = await bookingsService.findOne(req.params.id);

    if (!existingBooking || !existingBooking[0]) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = existingBooking[0];

    if (booking.imageUrl) {
      try {
        const url = new URL(booking.imageUrl);
        const relativePath = url.pathname;

        const imagePath = path.join(__dirname, "../../", relativePath);

        const normalizedPath = imagePath.replace(/^\/+/, "");

        if (fs.existsSync(normalizedPath)) {
          fs.unlinkSync(normalizedPath);
          console.log("Deleted booking image:", normalizedPath);
        } else {
          console.log("Booking image not found:", normalizedPath);
        }
      } catch (err) {
        console.error("Invalid image URL:", booking.imageUrl);
      }
    }

    const deletedBooking = await bookingsService.deleteBooking(req.params.id);

    res.json({
      frontFacingMessage: "Booking deleted successfully",
      data: deletedBooking,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
