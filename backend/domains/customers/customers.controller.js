const customersService = require("./customers.servcie");

// GET /
exports.getAll = async (req, res) => {
  try {
    const customers = await customersService.getAllCustomers();

    res.json({
      frontFacingMessage: "Customers retrieved successfully",
      data: customers,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /:id
exports.getOne = async (req, res) => {
  try {
    const customer = await customersService.getCustomerById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({
      frontFacingMessage: "Customer retrieved successfully",
      data: customer,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /
exports.create = async (req, res) => {
  try {
    const newCustomer = await customersService.createCustomer(req.body);

    res.json({
      frontFacingMessage: "Customer created successfully",
      data: newCustomer,
      httpStatus: 201,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /:id
exports.update = async (req, res) => {
  try {
    const updated = await customersService.updateCustomer(
      req.params.id,
      req.body,
    );

    if (!updated) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({
      frontFacingMessage: "Customer updated successfully",
      data: updated,
      httpStatus: 201,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /:id
exports.remove = async (req, res) => {
  try {
    const deleted = await customersService.deleteCustomer(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({
      frontFacingMessage: "Customer deleted successfully",
      data: deleted,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
