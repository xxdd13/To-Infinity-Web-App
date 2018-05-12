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

router.get('/eventX',ensureAuthenticated,controllers.eventX);
router.get('/event/:eventID',ensureAuthenticated,controllers.event);
router.get('/create_event',ensureAuthenticated,controllers.create_event);
router.get('/needLogin',controllers.needLogin);

router.post('/createEvent',controllers.create);
router.get('/img/:id',controllers.imgid);

router.get('/join',controllers.joinList);
router.post('/join',controllers.join);
router.post('/quitEvent',controllers.quitEvent);


router.post('/updatebio',controllers.updatebio);
router.post('/eventX',controllers.like);
router.post('/event',controllers.like);
router.post('/index',controllers.like);
//deletes
router.get('/de',controllers.deleteAllEvents);
router.get('/dl',controllers.deleteLikes);
router.post('/delete-event',controllers.deleteEvent);
module.exports = router;