const express = require("express");
const cors = require("cors");

const customerRoutes = require("./domains/customers/customers.routes");
const carsRoutes = require("./domains/cars/cars.routes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/customers", customerRoutes);
app.use("/api/cars", carsRoutes);

module.exports = app;
