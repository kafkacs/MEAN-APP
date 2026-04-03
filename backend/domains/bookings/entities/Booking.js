const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  carID: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: false, default: 0 },
});

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;
