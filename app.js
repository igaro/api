#!/usr/bin/node

"use strict";

// core requires
var express         = require('express');
var session         = require("express-session");
var memcached       = require("connect-memcached");
var cookieParser    = require("cookie-parser");
var passport        = require("passport");
var passport_local  = require("passport-local");

// app variables
var app             = express();

// app requires
var config          = require("./lib/config.js");
var Router          = require("./lib/Router.js");
var users           = require("./lib/users.js");

// use cookies
app.use(cookieParser());

// memcache for sessions
var sessionCfg = config.get('session');
app.use(session({
    secret: sessionCfg.secret,
    store: new memcached(session)({
        client: config.get('memcached'),
        prefix: "session."
    }),
    cookie: { maxAge: sessionCfg.timeout },
    rolling: true,
    resave : false,
    saveUninitialized: true
}));

// auth: json web token mechanism
passport.use(new passport_local.Strategy(
    { passReqToCallback: true },
    function(req, username, password, done) {
        users.getByUID(username).then(
            function(user) { done(null, user.validate(password)? user : false); },
            function() { done(null, false); }
        );
    }
));

// auth: login
app.use(passport.initialize());
app.use(passport.session());
app.post('/authenticate', function(req, res) {
    passport.authenticate('local', function(err, user, info) {
        if (err || ! user)
            return res.send(401, { retry:true, msg:err.message });
        req.logIn(user, {}, function (err) {
            if (err) {
                return res.send(401, {
                    retry:true,
                    err:err,
                    info:info
                });
            }
            res.send(200);
	    });
    })(req, res);
});

// auth: logout
app.get('/logout', function(req, res) {
    req.session.destroy(res.json);
    app.emit('session.destroy');
    res.send(200);
});

// routes: default providers
app.all('/routes', function(req, res) {
    res.sendfile('./routes.json');
});

// root Router
var root = new Router({
    path: __dirname + '/routes',
    app: app
});

// router: install
app.all('/routes/*', function(req,res) {
    // parse uri segments
    req.igaroRouter = {
        uri: {
            orig:req.url.match('^[^?]*')[0].split('/'),
            at:0
        }
    };
    root.exec(app,req,res).catch(function (e) {
        console.error(e);
        res.send(500);
    });
});

// static files (routes can secure paths)
app.use(express.static(__dirname + '/serve'));

// unrecognised request
app.use(function(req, res) {
    res.send(400);
});

// start server
var server = app.listen(config.get('service').port || 80, function() {
    console.info('APP: Listening on port %d', server.address().port);
});

module.exports = { app:app };
