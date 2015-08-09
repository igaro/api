"use strict";

var DBMS = require('../DBMS.js');
var crypto = require('crypto');

var hashit = function(pwd,salt) {

	return crypto.createHash('sha256').update(pwd+salt).digest('hex');
};

// USER
var User = function(o) {
	this.data = o;
};

User.prototype.validatePassword = function(pwd) {

    var data = this.data;
    return data.password === hashit(pwd, data.salt);
};

User.prototype.setPassword = function(pwd) {

    var data = this.data;
    pwd = data.password = hashit(pwd, data.salt);
    return DBMS.query('UPDATE users SET password=?? WHERE id=?? LIMIT 1',[pwd,data.id]);
};

User.prototype.getAttribute = function(o) {

    return this.data[o];
};

// export
module.exports = {

	getByUID : function(uid) {
	    return DBMS.query('SELECT * from users WHERE id=?? OR username=?? OR email=?? LIMIT 1', [uid, uid, uid]).then(function(data) {
            if (data)
                return new User(data);
        });
	}
};
