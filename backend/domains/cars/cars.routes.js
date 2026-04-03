const express = require("express");
const router = express.Router();
const { param } = require("express-validator");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const controller = require("./cars.controller");

//findAll cars
router.get("/", auth({ required: false }), controller.getAll);

//findOne car
router.get(
  "/:id",
  auth({ required: false }),
  param("id").isMongoId().withMessage("Invalid customer ID"),
  validate,
  controller.getOne,
);

//create car
router.post("/", auth({ required: false }), controller.create);

//update car
router.patch(
  "/:id",
  auth({ required: true }),
  param("id").isMongoId().withMessage("Invalid customer ID"),
  validate,
  controller.update,
);

//delete car
router.delete(
  "/:id",
  auth({ required: true }),
  param("id").isMongoId().withMessage("Invalid customer ID"),
  validate,
  controller.remove,
);

module.exports = router;
