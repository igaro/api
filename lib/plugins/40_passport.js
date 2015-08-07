"use strict";

var passport        = require("passport");
var passport_local  = require("passport-local");
var users           = require("../users.js");

module.exports = function () {

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

};
