const faker = require('../models/faker');
const User = require('../models/user');

module.exports.index = function(req, res) {
    res.render('index',{user:((req.session.user)?(req.session.user): false)});


};

module.exports.users = function(req, res) {
    /* GET users listing. */
        res.render('users', {
            title :'User List',
            userList : faker,
            user:{user:((req.session.user)?(req.session.user): false)},
        });

};
module.exports.fetchAllPosts = function(req, res) {
    res.send("posts obj");
};

module.exports.login = function(req, res) {
    res.render('login',{user:((req.session.user)?(req.session.user): false)});
};

module.exports.loginReq = function(req, res,next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }

    if (req.body.email &&
        req.body.userName &&
        req.body.password &&
        req.body.passwordConf) {

        var userData = {
            email: req.body.email,
            username: req.body.userName,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
        }

        User.create(userData, function (error, user) {
            if (error) {

                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/');
            }
        });

    } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                req.session.user = user;
                return res.redirect('/');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
};

/*
module.exports.fetchPost = function(req, res) {
    constpost = posts[req.params.id];
    res.render('post_template', {
        post: post
    });
};
*/