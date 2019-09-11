const createError = require('http-errors');
const express = require('express');
const router = require('./routes/index.js');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const chalk = require('chalk')
const config = require('config-lite')(__dirname)

// Redis session storage for Express ---start
const redis = require('redis')
const session = require('express-session')
let RedisStore = require('connect-redis')(session)
let client = redis.createClient()

client.on('ready', function() {
    console.log(chalk.blue(`redis-server is ready...`))
})
client.on('error', console.error)
// Redis session storage for express ---end

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        store: new RedisStore({
            client
        }),
        secret: config.session.secret,
        name: config.session.name,
        cookie: config.session.cookie,
        resave: false
    })
)
app.use(function(req, res, next) {
    if (!req.session) {
        return next(new Error('oh no'))
    }
    next()
})


router(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;