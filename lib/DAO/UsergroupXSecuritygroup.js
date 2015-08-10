"use strict";

var DBMS = require('../DBMS.js');

var UsergroupXSecuritygroup = function(o) {
    var self = this;
    Object.keys(o).forEach(function(key) {
        self[key] = o[key];
    });
    Object.freeze(this);
};
UsergroupXSecuritygroup.prototype.rm = function() {
    return DBMS.query('DELETE FROM UsergroupXSecuritygroup WHERE Usergroup_id=? AND Securitygroup=? LIMIT 1', [this.Usergroup_id, this.Securitygroup_id]);
};

module.exports = {

	getByUsergroupId : function(id) {
	    return DBMS.query('SELECT * from UsergroupXSecuritygroup WHERE Usergroup_id=?', [id]).then(function(data) {
            return data.map(function(data) { return new UsergroupXSecuritygroup(data); });
        });
	},

	getBySecuritygroupId : function(id) {
	    return DBMS.query('SELECT * from UsergroupXSecuritygroup WHERE Securitygroup_id=?', [id]).then(function(data) {
            return data.map(function(data) { return new UsergroupXSecuritygroup(data); });
        });
	},

    wipe : function() {
	    return DBMS.query('DELETE FROM UsergroupXSecuritygroup');
    },

    mk : function(o) {
	    return DBMS.query('INSERT INTO UsergroupXSecuritygroup (Usergroup_id, Securitygroup_id) VALUES (?,?)', [o.usergroup_id, o.securitygroup_id]);
    }

};
