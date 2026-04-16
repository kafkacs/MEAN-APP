const carsService = require("./cars.service");
const path = require("path");
const fs = require("fs");

// find all /
exports.getAll = async (req, res) => {
  try {
    const { skip, limit } = req.query;

    if (!skip || !limit) {
      return res.status(400).json({ message: "skip and limit are required" });
    }

    const cars = await carsService.getAllCars(req.query);

    res.json({
      frontFacingMessage: "Cars retrieved successfully",
      data: cars,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// find one
exports.getOne = async (req, res) => {
  try {
    const car = await carsService.getCarById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({
      frontFacingMessage: "Car retrieved successfully",
      data: car,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create one car
exports.create = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const relativePath = path.relative(
        path.join(__dirname, "../../"),
        req.file.path,
      );

      imageUrl =
        `${req.protocol}://${req.get("host")}` +
        "/" +
        relativePath.replace(/\\/g, "/");
    }

    const carData = {
      ...req.body,
      imageUrl,
    };

    const newCar = await carsService.createCar(carData);

    res.status(201).json({
      frontFacingMessage: "Car created successfully",
      data: newCar,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// update one car
exports.update = async (req, res) => {
  try {
    const existingCar = await carsService.getCarById(req.params.id);

    if (!existingCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    let imageUrl = existingCar.imageUrl;

    if (req.file) {
      if (existingCar.imageUrl) {
        const url = new URL(existingCar.imageUrl);
        const relativePath = url.pathname;

        const imagePath = path.join(__dirname, "../../", relativePath);

        const normalizedPath = imagePath.replace(/^\/+/, "");

        if (fs.existsSync(normalizedPath)) {
          fs.unlinkSync(normalizedPath);
          console.log("Deleted:", normalizedPath);
        } else {
          console.log("File not found:", normalizedPath);
        }
      }

      const relativePath = path.relative(
        path.join(__dirname, "../../"),
        req.file.path,
      );

      imageUrl =
        `${req.protocol}://${req.get("host")}` +
        "/" +
        relativePath.replace(/\\/g, "/");
    }

    const updatedData = {
      ...req.body,
      imageUrl,
    };

    const updatedCar = await carsService.updateCar(req.params.id, updatedData);

    res.json({
      frontFacingMessage: "Car updated successfully",
      data: updatedCar,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /:id
exports.remove = async (req, res) => {
  try {
    const existingCar = await carsService.getCarById(req.params.id);

    if (!existingCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (existingCar.imageUrl) {
      const url = new URL(existingCar.imageUrl);
      const relativePath = url.pathname;

      const imagePath = path.join(__dirname, "../../", relativePath);

      const normalizedPath = imagePath.replace(/^\/+/, "");

      if (fs.existsSync(normalizedPath)) {
        fs.unlinkSync(normalizedPath);
        console.log("Deleted:", normalizedPath);
      } else {
        console.log("File not found:", normalizedPath);
      }
    }

    const deleted = await carsService.deleteCar(req.params.id);

    res.json({
      frontFacingMessage: "Car deleted successfully",
      data: deleted,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
