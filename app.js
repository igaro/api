#!/usr/bin/node

var express         = require('express');
var session         = require("express-session");
var memcached       = require("connect-memcached");
var bodyParser      = require('body-parser');
var cookie_parser   = require("cookie-parser");
var passport        = require("passport");
var passport_local  = require("passport-local");

var app = express.Router();

var app = express();
var config = app.config = require('./etc/config.json');

var Router = require("./lib/Router.js");
var Users = require("./lib/Users.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookie_parser());

app.use(session({
    secret: 'F$S3EF%fofg',
    store: new memcached(session)({
        client: config.memcached,
        prefix: "session."
    }),
    cookie: { maxAge: config.session.timeout },
    rolling: true,
    resave : false, 
    saveUninitialized: true
}));

// auth is via json web token
passport.use(new passport_local.Strategy(
    { passReqToCallback: true },
    function(req, username, password, done) {
        Users.getByUID(username).then(
            function(user) { done(null, user.validate(password)? user : false); },
            function(err) { done(null, false); }
        );
    }
));
app.use(passport.initialize());
app.use(passport.session());
app.post('/authenticate', function (req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err || ! user) return res.send(401, { retry:true, msg:err.message });
        req.logIn(user, {}, function (err) { res.send(err? 401: 200, { retry:true, msg:err }) });
    })(req, res);
});

app.get('/logout', function(req, res, next) {
    req.session.destroy(res.json);
});

// a list of default routes can always be requested
app.all('/routes', function(req, res, next) {
    res.sendfile('./routes.json');
});

// install base router - this will traverse and install children
var router = new Router(app);
router.name = '';
router.path += '/routes';
router.fullpath = router.path+'/'+router.name;
router.registerChildren();

// static files (routes can secure paths)
app.use(express.static(__dirname + '/serve'));

// unrecognised request
app.use(function(req, res) { res.send(400) });

var server = app.listen(config.service.port || 80, function() {
    console.log('Listening on port %d', server.address().port);
});

module.exports = { app: app };
