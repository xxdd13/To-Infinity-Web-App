const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');

function ensureAuthenticated(req, res, next) {
    // return Next if authenticated
    if (req.isAuthenticated()) { return next(); }

    res.redirect('/needlogin');
}

router.get('/', controllers.index);

router.get('/users', controllers.users);

router.get('/login', controllers.login);

router.post('/login',controllers.loginReq);

router.get('/profile',ensureAuthenticated,controllers.profile);
router.get('/logout',controllers.logout);

router.get('/d',controllers.deleteAll);

router.get('/eventX',controllers.eventX);
router.get('/create_event',controllers.create_event);
router.get('/needLogin',controllers.needLogin);

router.post('/createEvent',controllers.create);
router.get('/de',controllers.deleteEvents);
router.get('/img/:id',controllers.imgid);





//router.get('/posts/:id', controllers.fetchPost);
module.exports = router;