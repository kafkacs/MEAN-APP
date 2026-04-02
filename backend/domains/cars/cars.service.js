const Car = require("./entities/Car");

// find all cars
const getAllCars = async (query) => {
  const { skip, limit, ...restOfQuery } = query;
  return await Car.find(restOfQuery).skip(skip).limit(limit);
};

// find one car by id
const getCarById = async (id) => {
  return await Car.findById(id);
};

// create car
const createCar = async (data) => {
  const car = new Car(data);
  return await car.save();
};

// update car (PATCH)
const updateCar = async (id, data) => {
  return await Car.findByIdAndUpdate(id, data, { new: true });
};

// delete car
const deleteCar = async (id) => {
  return await Car.findByIdAndDelete(id);
};

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
