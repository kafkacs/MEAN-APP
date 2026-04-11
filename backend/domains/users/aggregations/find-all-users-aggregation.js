const mongoose = require("mongoose");

const buildFindAllUsersAggregation = (params = {}) => {
  const { skip = 0, limit = 10, ...filters } = params;

  if (filters._id) {
    filters._id = new mongoose.Types.ObjectId(filters._id);
  }

  return [
    {
      $match: {
        isDeleted: { $ne: true },
        ...filters,
      },
    },

    {
      $project: {
        password: 0,
      },
    },

    {
      $skip: Number(skip),
    },
    {
      $limit: Number(limit),
    },
  ];
};

module.exports = {
  buildFindAllUsersAggregation,
};
