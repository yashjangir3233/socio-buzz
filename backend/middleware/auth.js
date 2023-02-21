const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        success: false,
        error: "You must be logged in",
      });
    }

    const token = authorization.replace("Bearer ", "");
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData._id);
    next();
  } catch (err) {
    return res.json({
      success: false,
      error: "You must be logged in: invalid token",
    });
  }
};
