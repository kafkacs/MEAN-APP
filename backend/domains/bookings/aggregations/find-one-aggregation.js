const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const buildFindOneAggregation = (bookingID) => {
  return [
    { $match: { _id: new ObjectId(bookingID) } },
    {
      $lookup: {
        from: "users",
        localField: "userID",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "cars",
        localField: "carID",
        foreignField: "_id",
        as: "car",
      },
    },
    {
      $unwind: {
        path: "$car",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        totalPrice: 1,
        startDate: 1,
        endDate: 1,
        startTime: 1,
        nameOfBooker: 1,
        emailOfBooker: 1,
        contactNumberOfBooker: 1,
        createdAt: 1,
        endTime: 1,
        status: 1,
        imageUrl: 1,
        "car.carName": 1,
        "car.pricePerDay": 1,
        "car.imageUrl": 1,
        "car.transmissionType": 1,
        "car.model": 1,
        "car.carType": 1,
        "user.fullName": 1,
        "user.email": 1,
        "user.role": 1,
        "user.birthDate": 1,
        "user.phone": 1,
      },
    },
  ];
};

module.exports = {
  buildFindOneAggregation,
};
