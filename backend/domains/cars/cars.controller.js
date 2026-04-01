const carsService = require("./cars.service");

// GET /
exports.getAll = async (req, res) => {
  try {
    const cars = await carsService.getAllCars();
    //TODO:return all requests as this structure { frontFacingMessage, data, httpStatus }
    res.json({
      frontFacingMessage: "Cars retrieved successfully",
      data: cars,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET One
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

// POST /
exports.create = async (req, res) => {
  try {
    const newCar = await carsService.createCar(req.body);

    res.json({
      frontFacingMessage: "Car created successfully",
      data: newCar,
      httpStatus: 201,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /:id
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

// DELETE /:id
exports.remove = async (req, res) => {
  try {
    const deleted = await carsService.deleteCar(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({
      frontFacingMessage: "Car deleted successfully",
      data: deleted,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
