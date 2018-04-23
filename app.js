//heroku  https://git.heroku.com/murmuring-inlet-97299.git

const dev = 0;  // Local = 1, heroku = 0   don't forget to change config.js in /configertion

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
var multer  = require('multer');





// Connects MongoDB
const mongoURI = "mongodb+srv://info30005thursday:Info30005@cluster0-rcw4z.mongodb.net/auth";
mongoose.connection.on('connected', function() {
    // makes sure we are not connecting to admin database
    if (mongoose.connection.client.s.url.startsWith('mongodb+srv')) {
        mongoose.connection.db = mongoose.connection.client.db('fbAuth');
    }
});
//mongoose.connect('mongodb://localhost/testForAuth');
mongoose.connect(mongoURI);
var db = mongoose.connection;

// throw error if mongoDB is not connected otherwise ok
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('mongodb connection okay');
});


// Checking if the User is logged in or not (Old Password and Email login system)
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


// Process storing the User Info once you get the Callback URL from FB
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



// Find all the Users and Delete
app.get('/d', function(req, res){
    User.remove({}, function(err) {
        console.log('collection removed');
        User.collection.dropIndexes();
        User.collection.drop();


    });



});

// Call the Profile page
// ensureAuthenticated: Ensures you logged in
app.get('/profile', ensureAuthenticated, function(req, res){
    User.findById(req.session.passport.user, function(err, user) {

        // Error
        if(err) {
            console.log(err);

        } else {
            res.render('profile', { user: user});
        }
    });
});

// Authenticating with Facebook (When clicking on the link)
// Uses passport to authenticate (simplifying it)
app.get('/auth/facebook',
    passport.authenticate('facebook'));

// Callback from Facebook
app.get('/auth/facebook/callback',

    // If not successful, return to main page TBA
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        // If successful, return to profile
        res.redirect('/profile');
    });

// Event page
app.get('/eventX', ensureAuthenticated,function(req, res) {
    User.findById(req.session.passport.user, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            res.render('eventX', { user: user});
        }
    });
});


// Event page
app.get('/needlogin',function(req, res) {
    res.render('flogin', { user: null});
});

app.get('/create-event', ensureAuthenticated, function(req, res){
    User.findById(req.session.passport.user, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            res.render('createEvent', { user: user});
        }
    });

});
/*
app.post('/create-event', upload.array('image', 5), (req, res, next) => {
  const images = req.files.map((file) => {
    return {
      filename: file.filename,
      originalname: file.originalname
    }
  })
  Image.insertMany(images, (err, result) => {
    if (err) return res.sendStatus(404)
    res.json(result)
  })
})
*/
// get image with id
var busboy = require('connect-busboy');
app.use(busboy());
app.post('/upload',function (req, res, next) {

        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/img/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {
                console.log("Upload Finished of " + filename);
                res.redirect('back');           //where to go next
            });
        });
    });



// View Engine Setuo (views)
app.engine('html', ejs.renderFile); // Rendering HTML
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');  // Using EJS

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

// Body Parser MW
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Route
app.use('/', router);



// Function to ensure Authetication
function ensureAuthenticated(req, res, next) {
    // return Next if authenticated
    if (req.isAuthenticated()) { return next(); }

    res.redirect('/needlogin');
}


const PORT = process.env.PORT || 3000;


if(dev === 1){
    // Local server host
    https.createServer({
        key: fs.readFileSync('public/key.pem'),
        cert: fs.readFileSync('public/cert.pem')
    }, app).listen(PORT);

}else{
    //use this section for heroku
    app.listen(PORT, function(){
        console.log("Starting server at 3000");
    });

}






module.exports = app;
