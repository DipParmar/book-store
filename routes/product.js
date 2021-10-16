const express = require('express');
const { create, read, update, remove, productById } = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const router = express.Router();

router.get('/:productId', read);
router.post('/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete('/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/:productId/:userId', requireSignin, isAuth, isAdmin, update);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
