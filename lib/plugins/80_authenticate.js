"use strict";

var user        = require("../DAO/User.js");
var userAuth    = require("../DAO/UserAuth.js");
var bodyParser  = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app) {

    app.post('/authenticate', urlencodedParser, function(req, res) {

        if (! req.body)
            return res.sendStatus(400);

        var uid = req.body.uid,
            password = req.body.password,
            roaming = !! req.body.roaming,
            device = req.headers['user-agent'],
            ip = req.ip;

        if (! uid || ! password)
            return res.sendStatus(400);

        user.getByUid(uid).then(function(usr) {
            if (usr && usr.validatePassword(password)) {
                return userAuth.mk({
                    user_id:usr.data.id,
                    token:req.session.id,
                    ip:ip,
                    device:device,
                    roaming:roaming
                }).then(function() {
                    res.sendStatus(200);
                });
            }
            return res.sendStatus(401);
        }).catch(function (e) {
            console.error(e);
            return res.sendStatus(500);
        });

    });

};
