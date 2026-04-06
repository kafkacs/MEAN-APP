const Booking = require("./entities/Booking");
const carsService = require("../cars/cars.service");
const usersService = require("../users/users.servcie");
const {
  buildFindAllAggregation,
} = require("./aggregations/find-all-aggregation");

//find all bookings
const findAll = async (query) => {
  const { skip, limit, ...restOfQuery } = query;

  const pipeline = buildFindAllAggregation(restOfQuery, skip, limit);

  return await Booking.aggregate(pipeline);
};

//find one booking by id
const findOne = async (id) => {
  return await Booking.findById(id);
};

// create booking
const createBooking = async (data) => {
  if (!data.startDate || !data.endDate || !data.carID) {
    throw new Error("Missing required fields");
  }

  const currentDate = new Date();

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  const startDate = parseDate(data.startDate);
  const endDate = parseDate(data.endDate);

  if (isNaN(startDate) || isNaN(endDate)) {
    throw new Error("Invalid date format");
  }

  if (startDate < currentDate) {
    throw new Error("Start date cannot be in the past");
  }

  if (endDate <= startDate) {
    throw new Error("End date must be after start date");
  }

  const car = await carsService.getCarById(data.carID);

  if (!car) {
    throw new Error("Car not found");
  }

  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  const totalPrice = car.pricePerDay * days;

  const booking = new Booking({
    ...data,
    startDate,
    endDate,
    totalPrice,
  });

  if (data.userID) {
    const user = await usersService.getUserById(data.userID);
    user.bookingsIDs.push(booking._id);
    await user.save();
  }

  return await booking.save();
};

//update booking status
// const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
const updateBookingStatus = async (id, data) => {
  const booking = await Booking.findById(id);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (data.status == "confirmed") {
    const car = await carsService.getCarById(booking.carID);

    if (!car || !car.available) {
      throw new Error("Car not found or not available");
    }

    car.available = false;
    await car.save();
  }

  if (data.status == "cancelled" || data.status == "completed") {
    const car = await carsService.getCarById(booking.carID);

    if (!car) {
      throw new Error("Car not found!");
    }

    car.available = true;
    await car.save();
  }

  Object.assign(booking, data);
  return await booking.save();
};

//delete booking
const deleteBooking = async (id) => {
  return await Booking.findByIdAndDelete(id);
};

module.exports = {
  findAll,
  findOne,
  createBooking,
  updateBookingStatus,
  deleteBooking,
};
