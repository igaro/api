var express         = require('express');
var config          = require("../config.js");
var mode            = config.mode;

module.exports = function(app) {

    "use strict";

    // static files (secured by routes)
    //app.use(security);
    app.use('/public', express.static(__dirname + '/build/'+mode+'/public'));

};
