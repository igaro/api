"use strict";

var DBMS = require('../DBMS.js');

var Securitygroup = function(o) {
    var self = this;
    Object.keys(o).forEach(function(key) {
        self[key] = o[key];
    });
    Object.freeze(this);
};
Securitygroup.prototype.set = function(dataset) {
    return DBMS.query('UPDATE Securitygroup SET ? WHERE id=? LIMIT 1', [dataset, this.id]);
};
Securitygroup.prototype.rm = function() {
    return DBMS.query('DELETE FROM Securitygroup WHERE id=? LIMIT 1', [this.id]);
};

module.exports = {

	get : function(id) {
        if (typeof id === 'number')
            return DBMS.query('SELECT * from Securitygroup WHERE id=? LIMIT 1', [id]).then(function(data) {
                return new Securitygroup(data);
            });
        return DBMS.query('SELECT * from Securitygroup ORDER BY title').then(function(data) {
            return data.map(function(data) {
                return new Securitygroup(data);
            });
        });
	},

    wipe : function() {
        return DBMS.query('DELETE FROM Securitygroup');
    },

    mk : function(dataset) {
	    return DBMS.query('INSERT INTO Securitygroup SET ?', dataset);
    }

};
