var fs = require('fs');
var callerId = require('caller-id');
var express = require('express');

var obj = function(app) {
	this.app = app;
	var appbase = __dirname.substr(0, __dirname.length - 3);
	var interpath = callerId.getData().filePath.substr(appbase.length).substr(7);
	interpath = interpath.substr(0, interpath.length-3);
	this.path = appbase + 'serve/' +  interpath;
};

obj.prototype.write = function(h) {

};

obj.prototype.read = function() {

};

obj.prototype.delete = function() {

};

obj.prototype.secure = function(c, f) {
	var app = this.app, p = this.path;
	if (typeof c !== 'string') throw new Error('Child route is not a string. Value: '+c);
	if (c.indexOf('/') > -1) throw new Error('Route violation for '+p+'. Child route '+c+' not permitted');
	var r = p + (c.length? c : '');
	console.log('Securing Route:', r);
	app.all(r, f);
};

module.exports = obj;