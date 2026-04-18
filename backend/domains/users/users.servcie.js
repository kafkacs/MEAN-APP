const bcrypt = require("bcryptjs");
const User = require("./entities/User");
const {
  buildFindAllUsersAggregation,
} = require("./aggregations/find-all-users-aggregation");

const SALT_ROUNDS = 10;

const isBcryptHash = (value) =>
  typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);

const assertAtLeast18 = (birthDate) => {
  const bd = new Date(birthDate);
  if (Number.isNaN(bd.getTime())) {
    throw new Error("Invalid birthDate");
  }
  const ageMs = Date.now() - bd.getTime();
  const minAgeMs = 18 * 365.25 * 24 * 60 * 60 * 1000;
  if (ageMs < minAgeMs) {
    throw new Error("User must be at least 18 years old");
  }
};

const toPublicUser = (user) => {
  if (!user) return null;
  const o = user.toObject ? user.toObject() : { ...user };
  delete o.password;
  return o;
};

// get all
const getAllUsers = async (params) => {
  const aggregation = buildFindAllUsersAggregation(params);
  return await User.aggregate(aggregation).exec();
};

// get by id
const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};

// create
const createUser = async (data) => {
  const birthDate = data.birthDate;
  if (!birthDate) {
    throw new Error("birthDate is required");
  }
  assertAtLeast18(birthDate);

  if (!data.password) {
    throw new Error("password is required");
  }

  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = new User({
    ...data,
    email: data.email.trim().toLowerCase(),
    birthDate,
    password: hashed,
  });

  await user.save();
  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const stored = user.password;
  const match = isBcryptHash(stored)
    ? await bcrypt.compare(password, stored)
    : password === stored;

  if (!match) {
    throw new Error("Invalid email or password");
  }

  if (!isBcryptHash(stored)) {
    user.password = await bcrypt.hash(password, SALT_ROUNDS);
    await user.save();
  }

  return user;
};

// change password
const changePassword = async (userID, body) => {
  const { oldPassword, newPassword, confirmPassword } = body;

  const user = await User.findById(userID);
  if (!user) {
    throw new Error("User not found");
  }

  const stored = user.password;
  const isMatch = isBcryptHash(stored)
    ? await bcrypt.compare(oldPassword, stored)
    : oldPassword === stored;

  if (!isMatch) {
    throw new Error("Old password is incorrect");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("New password and confirm password do not match");
  }

  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await user.save();

  return toPublicUser(user);
};

// update
const updateUser = async (id, data) => {
  const payload = { ...data };
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, SALT_ROUNDS);
  }
  return await User.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true },
  ).select("-password");
};

// delete
const deleteUser = async (id) => {
  const user = await User.findById(id);
  user.isDeleted = !user.isDeleted;
  return await user.save();
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  toPublicUser,
  updateUser,
  deleteUser,
  changePassword,
};
