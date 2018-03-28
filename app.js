//heroku  https://git.heroku.com/murmuring-inlet-97299.git
const express = require('express');
const app = express();
const createError = require('http-errors');
const ejs  = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const router = require('./routes/routes');
const db = require('./models/db');

//use sessions to determine user logged in or not
app.use(session({
    secret: 'info30005',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log("Starting server at 3000");
});


module.exports = app;
