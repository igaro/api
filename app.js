#!/usr/bin/node

"use strict";

// handle uncaught exceptions
process.on('uncaughtException', function(e) {
    console.error(e);
});

// express app
var app             = require('express')();

// plugins
require("./lib/plugins.js")(app, __dirname + '/lib/plugins');
