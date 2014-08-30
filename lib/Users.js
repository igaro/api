var DMBS = require('./DBMS');
var Promise = require('es6-promise').Promise;
var crypto = require('crypto');

var hashit = function(pwd, salt) {
	return crypto.createHash('sha256').update(pwd+salt).digest('hex');
}

var User = function(o) {
	this.data = o;
}
User.prototype = {
	validatePassword : function(pwd) {
		var data = this.data;
		return data.password === hashit(pwd, data.salt);
	},
	setPassword : function(pwd) {
		var data = this.data;
		var pwd = data.password = hashit(pwd, data.salt);
		DBMS.users.find({ id: this.data.id }).update({ password: pwd });
	},
	setAttributes : function(o) {
		DBMS.users.find({ id: this.data.id }).update(o);
	},
	getAttribute : function(o) {
		return this.data[o];
	}
};


module.exports = {

	getByUID : function(uid) {

		return new Promise(function(resolve, reject) {
			DBMS.users.find(
				{ 
					$or : [
						{'id':uid},
						{'email':uid}
					]
				},
				{ limit: 1 },
				function(err, records) {
					if (err) return reject(err);
					resolve(records.length? new User(records[0]) : null);
				}
			);
		});

	}

}