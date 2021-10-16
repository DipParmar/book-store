const express = require('express');
const { create } = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const router = express.Router();

router.post('/create/:userId', requireSignin, isAuth, isAdmin, create);
router.param('userId', userById);
module.exports = router;
