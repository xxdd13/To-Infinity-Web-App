const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');
const User = require('../models/user');

router.get('/', controllers.index);
router.get('/users', controllers.users);
router.get('/login', controllers.login);
//git remote add heroku  https://git.heroku.com/murmuring-inlet-97299.git
router.post('/login',controllers.loginReq)


router.get('/profile', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
                }
            }
        });
});


router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});


//router.get('/posts', controllers.fetchAllPosts);
//router.get('/posts/:id', controllers.fetchPost);
module.exports = router;