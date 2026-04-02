const jwt = require("jsonwebtoken");
const User = require("../domains/users/entities/User");

const auth = (options = { required: true }) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      if (options.required) {
        return res
          .status(401)
          .json({ message: "No token, authorization denied" });
      } else {
        req.user = null;
        return next();
      }
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) throw new Error("User not found");

      next();
    } catch (err) {
      if (options.required) {
        return res.status(401).json({ message: "Token is invalid" });
      } else {
        req.user = null;
        next();
      }
    }
  };
};

module.exports = auth;
