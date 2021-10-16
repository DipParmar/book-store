const { StatusCodes } = require('http-status-codes');
const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

const create = (req, res) => {
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

module.exports = {
  create,
};
