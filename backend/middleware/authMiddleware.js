const jwt = require("jsonwebtoken");
const User = require("../models/UserModel.js");

require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Auth token missing", success: false });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findById(decoded.id || decoded._id); // use whatever you encoded in createSecretToken

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", success: false });
  }
};

module.exports = authMiddleware;
