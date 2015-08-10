"use strict";

var DBMS = require('../DBMS.js');


var UserAuth = function(o) {
    var self = this;
    Object.keys(o).forEach(function(key) {
        self[key] = o[key];
    });
    Object.freeze(this);
};
UserAuth.prototype.rm = function() {
    return DBMS.query('DELETE FROM UserAuth WHERE id=? LIMIT 1', [this.id]);
};
UserAuth.prototype.setStamp = function() {
    return DBMS.query('UPDATE UserAuth SET stamp=NOW() WHERE id=? LIMIT 1', [this.id]);
};


module.exports = {

	getByUserId : function(user_id) {
	    return DBMS.query('SELECT * from UserAuth WHERE User_id=? ORDER BY stamp', [user_id]).then(function(data) {
            return data.map(function(data) { return new UserAuth(data); });
        });
	},

	get : function(token) {
	    return DBMS.query('SELECT * from UserAuth WHERE id=? LIMIT 1', [token]).then(function(data) {
            return new UserAuth(data);
        });
	},

    wipe : function() {
	    return DBMS.query('DELETE FROM UserAuth');
    },

    mk : function(o) {
	    return DBMS.query('INSERT INTO UserAuth (User_id, id, ip_address, device, roaming) VALUES (?,?,?,?,?)', [o.user_id, o.token, o.ip, o.device,o.roaming]);
    }

};
