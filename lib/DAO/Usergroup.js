"use strict";

var DBMS = require('../DBMS.js');

var Usergroup = function(o) {
    var self = this;
    Object.keys(o).forEach(function(key) {
        self[key] = o[key];
    });
    Object.freeze(this);
};
Usergroup.prototype.set = function(dataset) {
    return DBMS.query('UPDATE Usergroup SET ? WHERE id=? LIMIT 1', [dataset, this.id]);
};
Usergroup.prototype.rm = function() {
    return DBMS.query('DELETE FROM Usergroup WHERE id=? LIMIT 1', [this.id]);
};

module.exports = {

	get : function(id) {
        if (typeof id === 'number')
            return DBMS.query('SELECT * from Usergroup WHERE id=? LIMIT 1', [id]).then(function(data) {
                return new Usergroup(data);
            });
        return DBMS.query('SELECT * from Usergroup ORDER BY title').then(function(data) {
            return data.map(function(data) {
                return new Usergroup(data);
            });
        });
	},

    wipe : function() {
        return DBMS.query('DELETE FROM Usergroup');
    },

    mk : function(dataset) {
	    return DBMS.query('INSERT INTO Usergroup (title) SET ?', dataset);
    }

};
