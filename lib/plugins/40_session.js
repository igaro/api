"use strict";

var userAuth        = require("../DAO/UserAuth.js");
var crypto          = require("crypto");

module.exports = function (app) {

    app.all('*', function(req,res,next) {

        // get token
        var token = req.params.token || req.cookies.token;

        // has token
        (token?
            userAuth.get(token).then(function(data) {
                if (data) {
                    var stamp = new Date(data.stamp);
                    // validate
                    if ((data.roaming || data.ip_address === req.ip) && (stamp.setSeconds(stamp.getSeconds() + data.max_age).getTime() > new Date.getTime() )) {
                        req.session = data;
                        return userAuth.setStamp(token);
                    } else {
                        return userAuth.rm(token);
                    }
                }
            })
            : Promise.resolve()
        ).then(function() {
            // create token
            if (! token) {
                token = crypto.randomBytes(128).toString('hex');
                res.header('Session', token);
                res.cookie('session',token, { maxAge: 9999999999 });
            }
            if (! req.session) {
                req.session = {
                    id: token
                };
            }
        }).catch(function (e) {
            console.error(e);
            return res.sendStatus(500);
        }).then(function() {
            next();
        });

    });

};
