"use strict";

var config = require(process.argv[2] || '../etc/default.json');
Object.freeze(config);

module.exports = config;
