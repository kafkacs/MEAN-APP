const express = require("express");
const cors = require("cors");
const requestLogger = require("./middlewares/logging");

const userRoutes = require("./domains/users/users.routes");
const carsRoutes = require("./domains/cars/cars.routes");
const messagesRoutes = require("./domains/messages/messages.routes");

const app = express();

app.use(requestLogger);

// middleware
app.use(cors());
app.use(express.json());

// TODO: move auth to routes of each domain and specify if it's required or not for each route. For now, we will use it globally for all routes.
app.use("/api/cars", carsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messagesRoutes);

module.exports = app;
