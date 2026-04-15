const buildFindAllUsersAggregation = (params = {}) => {
  const { skip = 0, limit = 10, ...filters } = params;

  const match = {
    isDeleted: { $ne: true },
  };

  if (filters._id) {
    match._id = new mongoose.Types.ObjectId(filters._id);
  }

  if (filters.email) {
    match.email = { $regex: filters.email, $options: "i" };
  }

  if (filters.fullName) {
    match.fullName = {
      $regex: filters.fullName,
      $options: "i",
    };
  }

  return [
    { $match: match },

    {
      $project: {
        password: 0,
      },
    },

    { $skip: Number(skip) },
    { $limit: Number(limit) },
  ];
};

module.exports = {
  buildFindAllUsersAggregation,
};
