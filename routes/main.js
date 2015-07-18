"use strict";

var Router = require("../libs/Router.js");
var router = new Router({ path:__dirname });

module.exports = function(app,req,res) {

    var arg = arguments;

    return Promise.resolve().then(function() {

        return res.json({ allgood:true });

        return router.exec.apply(arg);

    });

};


