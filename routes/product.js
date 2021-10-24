const express = require('express');
const {
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
  listSearch,
} = require('../controllers/product');

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const router = express.Router();

router.get('/', list);
router.get('/search', listSearch);
router.get('/category', listCategories);
router.post('/by/search', listBySearch);
router.get('/related/:productId', listRelated);

router.get('/:productId', read);
router.post('/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete('/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/:productId/:userId', requireSignin, isAuth, isAdmin, update);

router.get('/photo/:productId', getPhoto);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
