const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');

const userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'User not found',
      });
    }
    req.profile = user;
    next();
  });
};

module.exports = {
  userById,
};
