const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
