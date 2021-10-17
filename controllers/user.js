const User = require('../models/user');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

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

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const update = (req, res) => {
  User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }, (err, user) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: ReasonPhrases.BAD_REQUEST,
      });
    }

    user.hashed_password = undefined;
    user.salt = undefined;

    return res.json(user);
  });
};

const readAdmin = (req, res) => {
  res.json({
    user: req.profile,
  });
};

module.exports = {
  userById,
  read,
  update,
  readAdmin,
};
