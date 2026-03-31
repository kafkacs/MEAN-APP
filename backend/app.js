const express = require("express");
const cors = require("cors");
const auth = require("./middlewares/auth");

const customerRoutes = require("./domains/customers/customers.routes");
const carsRoutes = require("./domains/cars/cars.routes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// TODO: move auth to routes of each domain and specify if it's required or not for each route. For now, we will use it globally for all routes.
// Public routes (optional auth)
app.use("/api/cars", auth({ required: false }), carsRoutes);

// Protected routes (required auth)
app.use("/api/customers", auth({ required: true }), customerRoutes);

module.exports = app;
