const express = require("express");
const router = express.Router();
const { param } = require("express-validator");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");

const controller = require("./messages.controller");

router.get("/", auth({ required: true }), controller.findAll);

router.get(
  "/:id",
  auth({ required: true }),
  param("id").isMongoId().withMessage("Invalid message ID"),
  validate,
  controller.findOne,
);

router.patch(
  "/:id",
  auth({ required: true }),
  param("id").isMongoId().withMessage("Invalid message ID"),
  validate,
  controller.update,
);

router.post("/", auth({ required: false }), controller.create);

router.delete(
  "/:id",
  auth({ required: true }),
  param("id").isMongoId().withMessage("Invalid message ID"),
  validate,
  controller.delete,
);

module.exports = router;
