const carsService = require("./cars.service");

// GET /
exports.getAll = async (req, res) => {
  try {
    const cars = await carsService.getAllCars();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /:id
exports.getOne = async (req, res) => {
  try {
    const car = await carsService.getCarById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /
exports.create = async (req, res) => {
  try {
    const newCar = await carsService.createCar(req.body);
    res.status(201).json(newCar);
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

    res.json(updated);
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

    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
