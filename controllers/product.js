const fs = require('fs');
const formidable = require('formidable');
const _ = require('lodash');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

const create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Image could not be uploaded.',
      });
    }

    // Field Validation
    const { name, description, price, category, quantity, shipping } = fields;

    if ((!name || !description || !price || !category || !quantity, !shipping)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'All fields are required.',
      });
    }

    const product = new Product(fields);
    if (files.photo) {
      const FIVE_MB = 1024 * 1024 * 5;
      if (files.photo.size > FIVE_MB) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Image should not exceed more than 5 MB in size',
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

const read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

const update = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Image could not be uploaded.',
      });
    }

    // Field Validation
    const { name, description, price, category, quantity, shipping } = fields;

    if ((!name || !description || !price || !category || !quantity, !shipping)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'All fields are required.',
      });
    }

    const product = _.extend(req.product, fields);

    if (files.photo) {
      const FIVE_MB = 1024 * 1024 * 5;
      if (files.photo.size > FIVE_MB) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Image should not exceed more than 5 MB in size',
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};
const remove = (req, res) => {
  let product = req.product;
  product.remove((err, _deletedProduct) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: 'Product deleted successfully',
    });
  });
};

const productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Product not found`',
      });
    }
    req.product = product;
    next();
  });
};

module.exports = {
  create,
  read,
  productById,
  remove,
  update,
};
