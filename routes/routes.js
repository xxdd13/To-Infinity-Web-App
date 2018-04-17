const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');

router.get('/', controllers.index);

router.get('/users', controllers.users);

router.get('/login', controllers.login);

router.post('/login',controllers.loginReq);

//router.get('/profile',controllers.profile);
router.get('/logout',controllers.logout);

router.get('/ws', function(req, res, next) {
    res.render('info30005_ws2_css');
});



//router.get('/posts/:id', controllers.fetchPost);
module.exports = router;