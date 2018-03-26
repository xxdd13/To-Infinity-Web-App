var express = require('express');
var createError = require('http-errors');
var ejs  = require('ejs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

/*
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
const mongoURI = "mongodb+srv://info30005thursday:Info30005@cluster0-rcw4z.mongodb.net/testForAuth";
mongoose.connection.on('connected', function() {
    // Hack the database back to the right one, because when using mongodb+srv as protocol.
    if (mongoose.connection.client.s.url.startsWith('mongodb+srv')) {
        mongoose.connection.db = mongoose.connection.client.db('testForAuth');
    }
    console.log('Connection to MongoDB established.')
});
//mongoose.connect('mongodb://localhost/testForAuth');
mongoose.connect(mongoURI);
    var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('connected to database');
});

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));


*/
var router = require('./routes/routes');

var app = express();

// view engine setup
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//use sessions for tracking logins


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use('/', router);


// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});


const PORT = process.env.PORT || 3000;


app.listen(PORT, function(){
    //console.log(`Express listening on port ${PORT}`);
    console.log("Starting server at 3000");
});




//module.exports = app;
