const express = require("express");
const router = express.Router();
const { param } = require("express-validator");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const controller = require("./bookings.controller");

//findAll bookings
router.get("/", auth({ required: true }), controller.findAll);

//findOne booking
router.get(
  "/:id",
  auth({ required: true }),
  param("id").isMongoId().withMessage("Invalid booking ID"),
  validate,
  controller.findOne,
);

//find all bookings for a user
router.get(
  "/user/:userID",
  auth({ required: true }),
  controller.findAllForUser,
);

//create booking
router.post("/", auth({ required: false }), controller.create);

//update booking status
router.patch(
  "/:id",
  auth({ required: true }),
  param("id").isMongoId().withMessage("Invalid booking ID"),
  validate,
  controller.update,
);

//delete booking
router.delete(
  "/:id",
  auth({ required: true }),
  param("id").isMongoId().withMessage("Invalid booking ID"),
  validate,
  controller.delete,
);

module.exports = router;
