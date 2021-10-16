const express = require('express');
const { create, read, update, list, remove, categoryById } = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const router = express.Router();

router.post('/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/:categoryId', read);
router.put('/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);

router.get('/', list);

router.param('categoryId', categoryById);
router.param('userId', userById);
module.exports = router;
