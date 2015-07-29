"use strict";

// This module only supports one connection per node server.
// If you need more, increase your node cluster size.

var mysql = require("mysql");
var config = require("./config.js").db;

// make connection
var connection = mysql.createConnection(config);
connection.connect();

// register cleanup on exit
process.stdin.resume();
var releaseConnection = function () {
    try {
        connection.destroy();
    } catch(e) {
        console.error('DBMS', e);
    }
};
process.on('exit', releaseConnection);
process.on('SIGINT', releaseConnection);
process.on('uncaughtException', releaseConnection);

// export
module.exports = {

    connection : connection,

    format : mysql.format,

    query : function(sql,embed) {
        if (embed)
            sql = mysql.format(sql,embed);
        return new Promise(function(resolve,reject) {
            connection.query(sql, function(e,r) {
                if (e)
                    return reject(e);
                return resolve(r);
            });
        });
    }

};
