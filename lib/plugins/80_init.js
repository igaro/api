"use strict";

var init            = require("../../etc/conf.app.js");

module.exports= function(app) {

    app.all('/init', function(req, res) {
        init(req,res).catch(function(e) {
            console.error(e);
            res.sendStatus(typeof e === 'number'? e : 500);
        });
    });

};
