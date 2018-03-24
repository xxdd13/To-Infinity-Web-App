const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');

router.get('/users', controllers.users);
//router.get('/posts', controllers.fetchAllPosts);
//router.get('/posts/:id', controllers.fetchPost);
module.exports = router;