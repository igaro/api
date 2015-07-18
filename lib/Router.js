"use strict";

var fs = require('fs');

var getChildren = function(path) {
	return fs.readdirSync(path).filter(function(file) {
        return file.slice(0,-3) === '.js';
    }).map(function() {
        return require(path + '/' + file);
    });
};

var Router = function(o) {
    this.pool = getChildren(o.path);
};

Router.prototype.exec = function() {
   return Promise.all(this.pool.map(function(route) {
        return route.apply(arguments);
   }));
};

module.exports = Router;
