"use strict";

var passport        = require("passport");

module.exports = function(app) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.post('/authenticate', function(req, res) {
        passport.authenticate('local', function(err, user, info) {
            if (err || ! user)
                return res.sendStatus(401, { retry:true, msg:err.message });
            req.logIn(user, {}, function (err) {
                if (err) {
                    return res.sendStatus(401, {
                        retry:true,
                        err:err,
                        info:info
                    });
                }
                res.sendStatus(200);
            });
        })(req, res);
    });

};
