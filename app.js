//heroku  https://git.heroku.com/murmuring-inlet-97299.git

const dev = 1;  // Local = 1, heroku = 0   don't forget to change config.js in /configertion

const express = require('express');
const mongoose = require('mongoose');
const config = require('./configuration/config');
const app = express();
const createError = require('http-errors');
const fs = require('fs');
https = require('https');
const ejs  = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');

//const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/user');
const Image = require('./models/Image');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const router = require('./routes/routes');
const fbAuth = require('./authentication.js');
const fileUpload = require('express-fileupload');




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



var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var upload = multer({storage: storage}).single('img');

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.end('error request file');
        }
        var data = new Image({
            text: req.file.originalname,
            image: req.file.originalname
        });
        data.save().then((result) => {
            res.send(result);
            console.log(result);
            console.log(req.file);
            res.end('upload file success');
        });




    });
});



router.get('/img', function(req, res, next) {
    Image.find({Image}).then((images) => {
        res.render('img', {images: images});
    });
});

router.get('/img/:id', (req, res) => {
    var id = req.params.id
    Image.findById(id).then((result) => {
        res.render('pic', {text : result.text, image : result.image});
    }).catch((e) =>  res.send(e) );
});

router.get('/dimg', (req, res) => {
    Image.remove({}, function(err) {
        res.redirect('/img');
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
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
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
