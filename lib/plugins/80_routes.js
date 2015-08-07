"use strict";

var Route           = require("../Route.js");
var rootRoute       = new Route();

module.exports = function(app) {

    // router: install
    app.all('/routes/*', function(req,res) {
        // parse uri segments
        req.uri = {
            parts:req.url.match('^[^?]*')[0].split('/').slice(2),
            at:0
        };
        rootRoute.exec(app,req,res).catch(function (e) {
            console.error(e);
            res.sendStatus(typeof e === 'number'? e : 500);
        });
    });

};


