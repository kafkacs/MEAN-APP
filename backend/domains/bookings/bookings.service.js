const Booking = require("./entities/Booking");
const carsService = require("../cars/cars.service");
const usersService = require("../users/users.servcie");
const {
  buildFindAllAggregation,
} = require("./aggregations/find-all-aggregation");
const {
  buildFindAllForUserAggregation,
} = require("./aggregations/find-all-for-user-aggregation");
const fs = require("fs");

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
  currentDate.setUTCHours(0, 0, 0, 0);

  const parseDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
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

//find all bookings for a user
const findAllForUser = async (query, userID) => {
  const { skip, limit, ...restOfQuery } = query;
  const pipeline = buildFindAllForUserAggregation(
    { ...restOfQuery, userID: userID },
    skip,
    limit,
  );

  return await Booking.aggregate(pipeline);
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
  const booking = await Booking.findById(id);

  if (!booking) return null;

  // delete image if exists
  if (booking.imageUrl) {
    const filePath = booking.imageUrl.replace("http://localhost:3000/", "");

    fs.unlink(filePath, (err) => {
      if (err) console.log("Failed to delete image:", err);
    });
  }

  return await Booking.findByIdAndDelete(id);
};

module.exports = {
  findAll,
  findOne,
  findAllForUser,
  createBooking,
  updateBookingStatus,
  deleteBooking,
};
