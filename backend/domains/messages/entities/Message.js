const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "new",
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
