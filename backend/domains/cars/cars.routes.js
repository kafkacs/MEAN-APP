const express = require("express");
const router = express.Router();
const { param } = require("express-validator");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const controller = require("./cars.controller");

router.get("/", controller.getAll);
router.get(
  "/:id",
  auth({ required: false }),
  param("id").isMongoId().withMessage("Invalid customer ID"),
  validate,
  controller.getOne,
);
router.post("/", controller.create);
router.patch(
  "/:id",
  auth({ required: false }),
  param("id").isMongoId().withMessage("Invalid customer ID"),
  validate,
  controller.update,
);
router.delete(
  "/:id",
  auth({ required: false }),
  param("id").isMongoId().withMessage("Invalid customer ID"),
  validate,
  controller.remove,
);

module.exports = router;
