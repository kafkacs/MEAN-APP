const express = require("express");
const router = express.Router();
const { param } = require("express-validator");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");

const controller = require("./users.controller");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/logout", auth({ required: false }), controller.logout);

router.get("/", auth({ required: false }), controller.getAll);

router.get(
  "/:id",
  auth({ required: false }),
  param("id").isMongoId().withMessage("Invalid user ID"),
  validate,
  controller.getOne,
);

router.post("/", auth({ required: false }), controller.create);

router.put(
  "/:id",
  auth({ required: false }),
  param("id").isMongoId().withMessage("Invalid user ID"),
  validate,
  controller.update,
);

router.delete(
  "/:id",
  auth({ required: false }),
  param("id").isMongoId().withMessage("Invalid user ID"),
  validate,
  controller.remove,
);

module.exports = router;
