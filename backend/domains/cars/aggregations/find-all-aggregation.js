const buildFindAllAggregation = (filters = {}, skip = 0, limit = 10) => {
  const match = {};

  //boolean value
  if (filters.available !== undefined) {
    match.available =
      filters.available === "true" || filters.available === true;
  }

  return [
    { $match: match },

    { $skip: Number(skip) },
    { $limit: Number(limit) },

    {
      $project: {
        updatedAt: 0,
      },
    },
  ];
};

module.exports = {
  buildFindAllAggregation,
};
