const usersService = require("./users.servcie");

// GET /
exports.getAll = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();

    res.json({
      frontFacingMessage: "Users retrieved successfully",
      data: users,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /:id
exports.getOne = async (req, res) => {
  try {
    const user = await usersService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      frontFacingMessage: "User retrieved successfully",
      data: user,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /
exports.create = async (req, res) => {
  try {
    const newUser = await usersService.createUser(req.body);

    res.json({
      frontFacingMessage: "User created successfully",
      data: newUser,
      httpStatus: 201,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /:id
exports.update = async (req, res) => {
  try {
    const updated = await usersService.updateUser(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      frontFacingMessage: "User updated successfully",
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
    const deleted = await usersService.deleteUser(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      frontFacingMessage: "User deleted successfully",
      data: deleted,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
