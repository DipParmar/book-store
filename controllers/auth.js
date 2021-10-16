const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');

const signup = (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({ err: errorHandler(err) });
    } else {
      user.salt = undefined;
      user.hashed_password = undefined;
      res.json({ user });
    }
  });
};

const signin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'User with that email does not exist, please sign up',
      });
    }

    if (!user.authenticate(password)) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: ReasonPhrases.UNAUTHORIZED,
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC);
    res.cookie('t', token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

const signout = (req, res) => {
  res.clearCookie('t');
  res.json({ message: 'Signout success' });
};

const requireSignin = expressJwt({
  secret: process.env.JWT_SEC,
  algorithms: ['HS256'],
  userProperty: 'auth',
});

const isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: 'Access denied',
    });
  }
  next();
};

const isAdmin = (req, res, next) => {
  let isAdmin = req.profile.role === 1;
  if (!isAdmin) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: 'Admin resource! Access denied',
    });
  }
  next();
};

module.exports = {
  signup,
  signin,
  signout,
  requireSignin,
  isAuth,
  isAdmin,
};
