"use strict";

var fs = require('fs');

module.exports = function (app, dir) {

    return fs.readdirSync(dir).filter(function(file) {
        return file.slice(-3) === '.js';
    }).sort(function (a,b) {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    }).map(function(plugin) {
        console.info('Plugin: ' + dir+'/'+plugin);
        return require(dir + '/' + plugin)(app);
    });

};
