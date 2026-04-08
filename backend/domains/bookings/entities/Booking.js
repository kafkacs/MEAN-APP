const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    carID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    notes: {
      type: String,
      trim: true,
    },

    nameOfBooker: {
      type: String,
      required: true,
      trim: true,
    },

    emailOfBooker: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    contactNumberOfBooker: {
      type: String,
      required: true,
      trim: true,
    },

    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    imageUrl: {
      type: String,
    },

    //for cloud
    imagePublicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
