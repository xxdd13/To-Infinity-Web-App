//heroku  https://git.heroku.com/murmuring-inlet-97299.git

const express = require('express');
const mongoose = require('mongoose');
const config = require('./configuration/config');
const app = express();
const createError = require('http-errors');
var fs = require('fs');
https = require('https');
const ejs  = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
//const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/user');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const router = require('./routes/routes');
const fbAuth = require('./authentication.js');


const mongoURI = "mongodb+srv://info30005thursday:Info30005@cluster0-rcw4z.mongodb.net/auth";
mongoose.connection.on('connected', function() {
    // makes sure we are not connecting to admin database
    if (mongoose.connection.client.s.url.startsWith('mongodb+srv')) {
        mongoose.connection.db = mongoose.connection.client.db('testForAuth');
    }
});
//mongoose.connect('mongodb://localhost/testForAuth');
mongoose.connect(mongoURI);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('mongodb connection okay');
});

//use sessions to determine user logged in or not
app.use(session({
    secret: 'info',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: db
    })
}));


//facebook login, use session before init and passport session
app.use(passport.initialize());
app.use(passport.session());


// Use the FacebookStrategy within Passport.

/*
passport.use(new FacebookStrategy({
        clientID: config.facebook_api_key,
        clientSecret:config.facebook_api_secret ,
        callbackURL: 'https://localhost:3000/login/facebook/return'
    },
    function(accessToken, refreshToken, profile, cb) {
        process.nextTick(function () {
            //Check whether the User exists or not using profile.id
            //Further DB code.
            return cb(null, profile);
        });
    }
));



passport.use(new FacebookStrategy({
        clientID: config.facebook_api_key,
        clientSecret:config.facebook_api_secret ,
        callbackURL: 'https://localhost:3000/login/facebook/return',
        profileFields:['id','displayName','emails']
    }, function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        var currentUser = new User({
            email:profile.emails[0].value,
            name:profile.displayName
        });


        User.findOne({email:currentUser.email}, function(err, profile) {
            if(!profile) {
                currentUser.save(function(err, currentUser) {
                    if(err) return cb(err);
                    cb(null,currentUser);
                });
            } else {
                console.log(profile);
                cb(null, profile);
            }
        });
    }
));

passport.serializeUser(function(user, cb) {
    console.log(user);
    cb(null, user._id);
});

passport.deserializeUser(function(obj, cb) {
    User.findById(id, function(err, user) {
        cb(err, user);
    });

});




app.get('/login/facebook',
    passport.authenticate('facebook'));

app.get('/login/facebook/return',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });


*/





passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + user._id);
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        console.log(user);
        if(!err) done(null, user);
        else done(err, null);
    });
});

app.get('/d', function(req, res){
    User.remove({}, function(err) {
        console.log('collection removed');
        res.redirect('/profile');
    });


});
app.get('/profile', ensureAuthenticated, function(req, res){
    User.findById(req.session.passport.user, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            res.render('profile', { user: user});
        }
    });
});

app.get('/auth/facebook',
    passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/profile');
    });






// view engine setup
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', router);

app.use(function(req, res, next) {
    next(createError(404));
});



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}


const PORT = process.env.PORT || 3000;
/*
app.listen(PORT, function(){
    console.log("Starting server at 3000");
});

*/

https.createServer({
    key: fs.readFileSync('public/key.pem'),
    cert: fs.readFileSync('public/cert.pem')
}, app).listen(PORT);

module.exports = app;
