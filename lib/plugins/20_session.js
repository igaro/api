"use strict";

var session         = require("express-session");
var memcached       = require("connect-memcached");
var config          = require("../config.js");

module.exports = function (app) {

    // memcache for sessions
    var sessionCfg = config.session;
    app.use(session({
        secret: sessionCfg.secret,
        store: new memcached(session)({
            client: config.memcached,
            prefix: "session."
        }),
        cookie: { maxAge: sessionCfg.timeout },
        rolling: true,
        resave : false,
        saveUninitialized: true
    }));

};
