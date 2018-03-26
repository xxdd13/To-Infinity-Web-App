const express = require('express');
const router = express.Router();
const controllers = require('../controllers/c2');
const User = require('../models/user');

router.get('/', controllers.index);

module.exports = router;
