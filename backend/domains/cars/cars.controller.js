const carsService = require("./cars.service");

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
      const relativePath = req.file.path
        .split("backend\\")[1]
        .replace(/\\/g, "/");

      imageUrl = `${req.protocol}://${req.get("host")}/${relativePath}`;
    }

    const bookingData = {
      ...req.body,
      imageUrl,
    };
    const newCar = await carsService.createCar(bookingData);

    res.json({
      frontFacingMessage: "Car created successfully",
      data: newCar,
      httpStatus: 201,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// update one car
exports.update = async (req, res) => {
  try {
    const updated = await carsService.updateCar(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({
      frontFacingMessage: "Car updated successfully",
      data: updated,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /:id
exports.remove = async (req, res) => {
  try {
    const deleted = await carsService.deleteCar(req.params.id);

    if (!deleted) {
      return res.status(400).json({ message: err.message });
    }

    res.json({
      frontFacingMessage: "Car deleted successfully",
      data: deleted,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
