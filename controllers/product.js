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

const list = (req, res) => {
  const order = req.query.order ? req.query.order : 'asc';
  const sortBy = req.query.sortBy ? req.query.sortBy : 'name';
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  const MAX_LIMIT = 50;

  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(Math.min(limit, MAX_LIMIT))
    .exec((err, products) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: 'No products are available',
        });
      }
      res.json(products);
    });
};

const listRelated = (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, products) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: 'No related products are available',
        });
      }
      res.json(products);
    });
};

const listCategories = (req, res) => {
  Product.distinct('category', {}, (err, categories) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Categories not found.',
      });
    }
    res.json(categories);
  });
};

const listBySearch = (req, res) => {
  const order = req.body.order ? req.body.order : 'desc';
  const sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  const limit = req.body.limit ? parseInt(req.body.limit) : 100;
  const skip = parseInt(req.body.skip);
  const findArgs = {};

  console.log(req.body.filters);
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        });
      }
      res.json({
        size: products.length,
        products,
      });
    });
};

const getPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
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
  update,
  remove,
  list,
  listRelated,
  listCategories,
  listBySearch,
  getPhoto,
  productById,
};
