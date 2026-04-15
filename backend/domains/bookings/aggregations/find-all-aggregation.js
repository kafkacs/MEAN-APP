const mongoose = require("mongoose");

const buildFindAllAggregation = (filters = {}, skip = 0, limit = 10) => {
  const matchStage = {};

  if (filters.userID) {
    matchStage.userID = new mongoose.Types.ObjectId(filters.userID);
  }

  if (filters.carID) {
    matchStage.carID = new mongoose.Types.ObjectId(filters.carID);
  }

  if (filters.status) {
    matchStage.status = filters.status;
  }

  if (filters.startDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.startDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    matchStage.startDate = {
      $gte: start,
      $lte: end,
    };
  }

  return [
    { $match: matchStage },

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
        "car.imageUrl": 1,
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
