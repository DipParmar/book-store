const express = require('express');
const { userById } = require('../controllers/user');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const router = express.Router();

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

router.param('userId', userById);
module.exports = router;
