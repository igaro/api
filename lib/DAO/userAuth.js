"use strict";

var DBMS = require('../DBMS.js');

// export
module.exports = {

	getSessions : function(user_id) {

	    return DBMS.query('SELECT * from UserAuth WHERE User_id=??', [user_id]);
	},

	getSession : function(token) {

	    return DBMS.query('SELECT * from UserAuth WHERE id=?? LIMIT 1', [token]);
	},

    invalidate : function(token) {

	    return DBMS.query('DELETE FROM userAuth WHERE id=?? LIMIT 1', [token]);
    },

    addSession : function(user_id, token, ip, device, roaming) {

	    return DBMS.query('INSERT INTO UserAuth (id, User_id, ip_address, device, roaming) VALUES (??,??,??,??,??)', [token, user_id, ip, device, roaming]);
    },

    updateAccessTime : function(token) {

	    return DBMS.query('UPDATE UserAuth SET stamp=NOW() WHERE id=?? LIMIT 1', [token]);
    }

};
