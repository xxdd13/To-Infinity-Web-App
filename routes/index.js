const express = require('express');
const router = express.Router();
const controllers = require('../controllers/c2');

router.get('/', controllers.index);

module.exports = router;
