const express = require('express');
const { userById, read, update, readAdmin } = require('../controllers/user');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const router = express.Router();

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, readAdmin);

router.get('/user/:userId', requireSignin, isAuth, read);
router.put('/user/:userId', requireSignin, isAuth, update);

router.param('userId', userById);
module.exports = router;
