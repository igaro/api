"use strict";

var DBMS = require('../DBMS.js');
var config = require('../config.js');
var crypto = require('crypto');

var hashit = function(pwd,salt) {
	return crypto.createHash('sha256').update(pwd+salt+config.user.salt).digest('hex');
};

// USER
var User = function(o) {
    var self = this;
    Object.keys(o).forEach(function(key) {
        self[key] = o[key];
    });
    Object.freeze(this);
};
User.prototype.validatePassword = function(pwd) {
    return this.password === hashit(pwd, this.salt);
};
User.prototype.setPassword = function(pwd) {
    var hash = hashit(pwd,this.salt);
    return DBMS.query('UPDATE User SET password=? WHERE id=? LIMIT 1',[hash, this.id]);
};

module.exports = {

	getByUID : function(uid) {
	    return DBMS.query('SELECT * from User WHERE id=? OR username=? OR email=? LIMIT 1', [uid, uid, uid]).then(function(data) {
            return new User(data);
        });
	},

    rm : function(id) {
        if (typeof id === 'number')
            return DBMS.query('DELETE FROM User WHERE id=? LIMIT 1', [id]);
        return DBMS.query('DELETE FROM User');
    },

    mk : function(dataset) {
        return DBMS.query('INSERT INTO User SET ?', dataset);
    }

};
