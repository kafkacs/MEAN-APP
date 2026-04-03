const bookingsService = require("./bookings.service");

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
      data: booking,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create booking

exports.create = async (req, res) => {
  try {
    const newBooking = await bookingsService.createBooking(req.body);

    res.json({
      frontFacingMessage: "Booking created successfully",
      data: newBooking,
      httpStatus: 201,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//delete booking
exports.delete = async (req, res) => {
  try {
    const deletedBooking = await bookingsService.deleteBooking(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      frontFacingMessage: "Booking deleted successfully",
      data: deletedBooking,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
