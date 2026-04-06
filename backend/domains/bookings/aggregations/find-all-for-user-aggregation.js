const mongoose = require("mongoose");

const buildFindAllForUserAggregation = (filters = {}, skip = 0, limit = 10) => {
  const match = {};

  if (filters.userID) {
    match.userID = new mongoose.Types.ObjectId(filters.userID);
  }

  if (filters.carID) {
    match.carID = new mongoose.Types.ObjectId(filters.carID);
  }

  if (filters.startDate) {
    match.startDate = { $gte: new Date(filters.startDate) };
  }

  if (filters.endDate) {
    match.endDate = { $lte: new Date(filters.endDate) };
  }

  return [
    { $match: match },

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
        status: 1,
        "car.carName": 1,
        "car.pricePerDay": 1,
        "car.imageUrl": 1,
        "car.transmissionType": 1,
        "car.model": 1,
        "user.fullName": 1,
        "user.email": 1,
        "user.phone": 1,
      },
    },
  ];
};

module.exports = {
  buildFindAllForUserAggregation,
};
