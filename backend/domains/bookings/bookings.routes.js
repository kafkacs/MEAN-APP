const express = require("express");
const router = express.Router();
const { param } = require("express-validator");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const controller = require("./bookings.controller");

//findAll bookings
router.get("/", auth({ required: false }), controller.findAll);

//findOne booking
router.get(
  "/:id",
  auth({ required: false }),
  param("id").isMongoId().withMessage("Invalid booking ID"),
  validate,
  controller.findOne,
);

//create booking
router.post("/", auth({ required: false }), controller.create);

//delete booking
router.delete(
  "/:id",
  auth({ required: true }),
  param("id").isMongoId().withMessage("Invalid booking ID"),
  validate,
  controller.delete,
);

module.exports = router;
