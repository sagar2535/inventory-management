const jwt = require("jsonwebtoken");

exports.signJwtToken = (userId) => {
  return jwt.sign({ user: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// jwt.js

exports.verifyJwtToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error;
  }
};
