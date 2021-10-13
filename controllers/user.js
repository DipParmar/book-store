const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');

const signup = (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({ err: errorHandler(err) });
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
      return res.status(400).json({
        error: 'User with that email does not exist, please sign up',
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Please enter correct credentials',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SEC);
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

module.exports = {
  signup,
  signin,
  signout,
  requireSignin,
};
