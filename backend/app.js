const express = require("express");
const cors = require("cors");
const requestLogger = require("./middlewares/logging");

const userRoutes = require("./domains/users/users.routes");
const carsRoutes = require("./domains/cars/cars.routes");
const messagesRoutes = require("./domains/messages/messages.routes");
const bookingsRoutes = require("./domains/bookings/bookings.routes");

const app = express();

app.use(requestLogger);

app.use(cors());
app.use(express.json());

app.use("/api/cars", carsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/bookings", bookingsRoutes);

module.exports = app;
