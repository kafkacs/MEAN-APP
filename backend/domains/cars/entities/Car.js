const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    carName: { type: String, required: true },
    transmissionType: { type: Number, required: true },
    seatsNumber: { type: Number, required: true },
    carType: { type: String, required: true },
    model: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    available: { type: Boolean, required: true },
    books: [
      {
        bookingID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking",
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
      },
    ],
    imageUrl: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
  },
  { timestamps: true },
);

const Car = mongoose.model("Car", carSchema);
module.exports = Car;
