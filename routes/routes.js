const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');

router.get('/', controllers.index);

router.get('/users', controllers.users);

router.get('/login', controllers.login);

router.post('/login',controllers.loginReq);

router.get('/profile',controllers.profile);
router.get('/logout',controllers.profile);



//router.get('/posts/:id', controllers.fetchPost);
module.exports = router;