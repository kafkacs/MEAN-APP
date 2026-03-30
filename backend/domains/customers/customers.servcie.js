const Customer = require("./entities/Customer");

// get all
const getAllCustomers = async () => {
  return await Customer.find();
};

// get by id
const getCustomerById = async (id) => {
  return await Customer.findById(id);
};

// create
const createCustomer = async (data) => {
  const customer = new Customer(data);
  return await customer.save();
};

// update
const updateCustomer = async (id, data) => {
  return await Customer.findByIdAndUpdate(id, { $set: data }, { new: true });
};

// delete
const deleteCustomer = async (id) => {
  return await Customer.findByIdAndDelete(id);
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
