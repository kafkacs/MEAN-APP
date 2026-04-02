const User = require("./entities/User");

// get all
const getAllUsers = async (params) => {
  const { skip, limit, ...restOfParams } = params;
  return await User.find(restOfParams).skip(skip).limit(limit);
};

// get by id
const getUserById = async (id) => {
  return await User.findById(id);
};

// create
const createUser = async (data) => {
  const currentDate = new Date().now();

  if (data.birthdate - 18 * 365 * 24 * 60 * 60 * 1000 > currentDate) {
    throw new Error("User must be at least 18 years old");
  }

  const user = new User(data);

  return await user.save();
};

// update
const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, { $set: data }, { new: true });
};

// delete
const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
