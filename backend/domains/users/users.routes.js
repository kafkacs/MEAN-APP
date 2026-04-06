const express = require("express");
const router = express.Router();
const { param } = require("express-validator");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");

const controller = require("./users.controller");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/logout", auth({ required: false }), controller.logout);

router.get(
  "/logged-in-user",
  auth({ required: true }),
  controller.findLoggedInUser,
);

router.get("/", auth({ required: true }), controller.getAll);

router.get(
  "/:id",
  auth({ required: true }),
  param("id").isMongoId().withMessage("Invalid user ID"),
  validate,
  controller.getOne,
);

router.post("/", auth({ required: true }), controller.create);

router.put(
  "/:id",
  auth({ required: true }),
  param("id").isMongoId().withMessage("Invalid user ID"),
  validate,
  controller.update,
);

//delete user
router.delete(
  "/:id",
  auth({ required: true }),
  param("id").isMongoId().withMessage("Invalid user ID"),
  validate,
  controller.remove,
);

module.exports = router;
