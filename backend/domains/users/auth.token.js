const jwt = require("jsonwebtoken");

const expiresIn = () => process.env.JWT_EXPIRES_IN || "7d";

function signAuthToken(user) {
  const _id = user._id.toString();
  const payload = {
    _id,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn(),
  });
  const decoded = jwt.decode(token);

  return {
    token,
    expiresAt: decoded.exp,
    _id,
  };
}

module.exports = { signAuthToken, expiresIn };
