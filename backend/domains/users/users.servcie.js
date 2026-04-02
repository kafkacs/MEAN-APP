const User = require("./entities/User");

// get all
const getAllUsers = async () => {
  return await User.find();
};

// get by id
const getUserById = async (id) => {
  return await User.findById(id);
};

// create
const createUser = async (data) => {
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
