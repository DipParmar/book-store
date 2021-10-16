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

const read = (req, res) => {
  return res.json(req.category);
};

const update = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, data) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: errorHandler(err),
      });
    }
    return res.json(data);
  });
};

const remove = (req, res) => {
  const category = req.category;
  category.remove((err, data) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: errorHandler(err),
      });
    }
    return res.json({
      message: 'Category removed successfully',
    });
  });
};

const list = (req, res) => {
  Category.find().exec((err, data) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: errorHandler(err),
      });
    }
    return res.json(data);
  });
};

const categoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Category does not exist',
        });
      }
    }
    req.category = category;
    next();
  });
};

module.exports = {
  create,
  read,
  update,
  remove,
  list,
  categoryById,
};
