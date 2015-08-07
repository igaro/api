"use strict";

var config          = require("../config.js");

module.exports = function (app) {

    // cors
    var cors_headers = config.cors.headers;

    app.all('*', function(req, res, next) {
        Object.keys(cors_headers).forEach(function(k) {
            res.header(k,cors_headers[k]);
        });
        if (req.method === 'OPTIONS') {
            res.send(200);
        } else {
            next();
        }
    });

};
