const mongoose = require("mongoose");

const buildFindAllAggregation = (filters = {}, skip = 0, limit = 10) => {
  if (filters.userID) {
    filters.userID = new mongoose.Types.ObjectId(filters.userID);
  }

  if (filters.carID) {
    filters.carID = new mongoose.Types.ObjectId(filters.carID);
  }

  return [
    { $match: filters },

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

    { $skip: Number(skip) },
    { $limit: Number(limit) },

    {
      $project: {
        totalPrice: 1,
        startDate: 1,
        endDate: 1,
        startTime: 1,
        endTime: 1,
        status: 1,
        imageUrl: 1,
        "car.carName": 1,
        "car.pricePerDay": 1,
        "user.fullName": 1,
        "user.email": 1,
        "user.phone": 1,
      },
    },
  ];
};

module.exports = {
  buildFindAllAggregation,
};
