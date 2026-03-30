const customersService = require("./customers.servcie");

// GET /
exports.getAll = async (req, res) => {
  try {
    const customers = await customersService.getAllCustomers();
    res.json(customers);
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

    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /
exports.create = async (req, res) => {
  try {
    const newCustomer = await customersService.createCustomer(req.body);
    res.status(201).json(newCustomer);
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

    res.json(updated);
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

    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
