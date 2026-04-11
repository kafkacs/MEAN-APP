const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    birthDate: {
      type: Date,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    role: {
      type: Number,
      default: 1,
      required: false,
    },
    gender: {
      type: Number,
      default: 1,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    bookingsIDs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: false,
      },
    ],
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
