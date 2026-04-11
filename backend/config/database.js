const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in .env file");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);

  console.log("Connected to MongoDB");
};

module.exports = connectDB;
