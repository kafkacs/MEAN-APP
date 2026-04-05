const User = require("../domains/users/entities/User");
const getIdFromToken = require("./extractIdFromToken");

const attachAuthContext = (req, objectId) => {
  const idStr = objectId.toString();
  req.userId = idStr;
  req.auth = { _id: objectId, userId: idStr };
};

const clearAuthContext = (req) => {
  req.user = null;
  req.userId = null;
  req.auth = null;
};

const hasBearerAttempt = (req) => {
  const raw = req.header("Authorization")?.replace("Bearer ", "");
  return Boolean(raw?.trim());
};

const auth = (options = { required: true }) => {
  return async (req, res, next) => {
    const objectId = getIdFromToken(req);

    if (!objectId) {
      if (options.required) {
        return res.status(401).json({
          message: hasBearerAttempt(req)
            ? "Token is invalid"
            : "No token, authorization denied",
        });
      }
      clearAuthContext(req);
      return next();
    }

    try {
      const user = await User.findById(objectId).select("-password");
      if (!user) throw new Error("User not found");

      attachAuthContext(req, objectId);
      req.user = user;

      next();
    } catch {
      clearAuthContext(req);
      if (options.required) {
        return res.status(401).json({ message: "Token is invalid" });
      }
      next();
    }
  };
};

const protect = auth({ required: true });

module.exports = auth;
module.exports.protect = protect;
