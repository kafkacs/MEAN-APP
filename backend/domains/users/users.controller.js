const usersService = require("./users.servcie");
const { signAuthToken } = require("./auth.token");

const buildAuthResponse = (user) => {
  const { token } = signAuthToken(user);
  return {
    token,
  };
};

// find all /
exports.getAll = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    if (!skip || !limit) {
      return res.status(400).json({ message: "skip and limit are required" });
    }
    const users = await usersService.getAllUsers(req.query);

    res.json({
      frontFacingMessage: "Users retrieved successfully",
      data: users,
      httpStatus: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// find one /:id
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

// create  /
exports.create = async (req, res) => {
  try {
    const newUser = await usersService.createUser(req.body);

    res.status(201).json({
      frontFacingMessage: "User created successfully",
      data: buildAuthResponse(newUser),
      httpStatus: 201,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /register — same as create; explicit registration route
exports.register = async (req, res) => {
  try {
    const newUser = await usersService.createUser(req.body);

    res.status(201).json({
      frontFacingMessage: "Registered successfully",
      data: buildAuthResponse(newUser),
      httpStatus: 201,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await usersService.loginUser(email, password);

    res.json({
      frontFacingMessage: "Login successful",
      data: buildAuthResponse(user),
      httpStatus: 200,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// POST /logout
exports.logout = async (req, res) => {
  res.json({
    frontFacingMessage: "Logged out successfully",
    data: {
      hint: "Remove the token from the client (memory, localStorage, etc.).",
    },
    httpStatus: 200,
  });
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
