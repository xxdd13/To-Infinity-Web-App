const faker = require('../models/faker');
const User = require('../models/user');
module.exports.index = function(req, res) {
    res.render('index',{user:((req.session.user)?(req.session.user): false),user: req.user});
    //res.render('index',null);


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

module.exports.needLogin = function(req, res) {
    return res.render('flogin', { user: null});
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
                return res.redirect('/profile');
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
                console.log(user);
                res.redirect('/');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
};


module.exports.profile = function(req, res) {

    User.findById(req.session.passport.user, function(err, user) {

        // Error
        if(err) {
            console.log(err);

        } else {
            res.render('profile', { user: user});
        }
    });




};


module.exports.logout = function(req, res) {
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
};

module.exports.deleteAll = function(req, res) {
    User.remove({}, function(err) {
        console.log('collection removed');
        User.collection.dropIndexes();
        User.collection.drop();
    });
};


module.exports.deleteAll = function(req, res) {
    User.remove({}, function(err) {
        console.log('collection removed');
        User.collection.dropIndexes();
        User.collection.drop();
    });
};



module.exports.eventX = function(req, res) {
    User.findById(req.session.passport.user, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            res.render('eventX', { user: user});
        }
    });
};

module.exports.create_event = function(req, res) {
    User.findById(req.session.passport.user, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            res.render('createEvent', { user: user});
        }
    });
};

