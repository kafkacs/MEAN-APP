const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

/**
 * Reads `Authorization: Bearer <jwt>`, verifies it, returns the user id from payload field `_id` only.
 * @param {import("express").Request} req
 * @returns {mongoose.Types.ObjectId | null}
 */
function getIdFromToken(req) {
  const raw = req.header("Authorization")?.replace("Bearer ", "");
  const token = raw?.trim();
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded._id;
    if (id == null || !mongoose.Types.ObjectId.isValid(String(id))) {
      return null;
    }
    const idStr = String(id);
    return new mongoose.Types.ObjectId(idStr);
  } catch {
    return null;
  }
}

module.exports = getIdFromToken;
