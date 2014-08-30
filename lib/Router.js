var fs = require('fs');
var callerId = require('caller-id');
var express = require('express');

var obj = function(app) {
	this.app = app;
    var fullpath = callerId.getData().filePath;
	var path = this.path = fullpath.substr(0,fullpath.lastIndexOf('/'));
	this.name = fullpath.substring(path.length+1, fullpath.length-3);
	this.fullPath = this.path + '/' + this.name;
};

obj.prototype.registerChildren = function(h) {
	var app = this.app;
	var files = this.getChildren(), path = this.path + '/' + this.name, filepath, mod;
	files.forEach(function (file) {
	    filepath = path+'/'+file+'.js';
	    mod = require(filepath);
	    new mod(app);
	});
	return files;
};

obj.prototype.getChildren = function() {
	var path = this.path + '/' + this.name;
	if (! fs.existsSync(path)) {
		console.log('Warning: dir doesn\'t exist.', path);
		return [];
	}
	var files = fs.readdirSync(path);
	files.forEach(function (file, i) {
	    var filepath = path+'/'+file;
	    if (fs.statSync(filepath).isDirectory() || file.substr(file.length-3) !== '.js') files.splice(i,1);
	    files[i] = file.substr(0,file.length);
	});
	return files;
};

obj.prototype.append = function(type, c, f) {
	var app = this.app;
	if (typeof type !== 'string' || ! type in app) throw new Error('Missing or invalid Express type i.e all, get, post. Value is: '+type);
	var p = (this.path + '/' + this.name).substr(__dirname.length-3);
	if (typeof c !== 'string') throw new Error('Child route is not a string. Value: '+c);
	if (c.indexOf('/') > -1) throw new Error('Route violation for '+p+'. Child route '+c+' not permitted');
	var r = '/' + p + (c.length? c : '');
	console.log('Registering Route:',type, r);
	switch (type) {
		case 'all' :
			app.all(r, f);
		case 'get' :
			app.get(r, f);
		case 'post' :
			app.post(r, f);
	}
};

module.exports = obj;