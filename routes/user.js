const express = require('express');
const controller = require('../controller/user');
const router = express.Router();

router.get('/', controller.signup);

module.exports = router;
