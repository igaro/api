"use strict";

var fs = require('fs');
var mode = require('./config.js').get('mode');

var routeFiles = fs.readdirSync('./routes').filter(function(file) {
    return file.slice(-3) === '.js';
});

var getChildren = function(parent) {
    var pL = parent.length;
	return routeFiles.filter(function(file) {
        return file.slice(0, pL) === parent && file.slice(pL).slice(0,-3).indexOf('.') === -1;
    }).map(function(file) {
        return [file.slice(pL).split('.')[0], require('../routes/' + file)];
    }).reduce(function(a,b) {
        a[b[0]] = b[1];
        return a;
    }, {});
};

var Route = function(filename) {
    var noExt = filename? filename.slice(0,-3) : null;
    try {
        // add children
        this.pool = getChildren(noExt || '');
        if (noExt) {
            // add css
            var fileChk = __dirname + "/../build/"+mode+"/routes/css/"+noExt+'.css';
            if (fs.existsSync(fileChk)) {
                this.css = fs.readFileSync(fileChk, "utf8");
            }
            // add view
            fileChk = __dirname + "/../build/"+mode+"/routes/views/"+filename;
            if (fs.existsSync(fileChk)) {
                this.view = fs.readFileSync(fileChk, "utf8");
            }
        }
    } catch(e) {
        console.error(e);
    }
};

// tries to handle the next uri segment
Route.prototype.exec = function(app,req,res) {
    var pool = this.pool,
        uri = req.uri,
        part = uri.parts[uri.at];
    console.log(pool);
    if (! part)
        return Promise.reject(400);
    var route = pool[part];
    if (! route)
        return Promise.reject(404);
    uri.at++;
    return route(app,req,res);
};

module.exports = Route;
