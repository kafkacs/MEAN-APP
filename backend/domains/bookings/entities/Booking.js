const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    carID: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, required: true, default: "pending" },
    notes: { type: String, required: false },
    nameOfBooker: { type: String, required: true },
    emailOfBooker: { type: String, required: true },
    contactNumberOfBooker: { type: String, required: true },
    totalPrice: { type: Number, required: false, default: 0 },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;
