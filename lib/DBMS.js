"use strict";

var mysql = require("mysql");
var config = require("./config.js").db;

var connections = [];
var available = [];

// send SIGQUIT not SIGINT to gracefully manage database transactions
var goingDown = false;

// create connection
var createConnection = function() {

    if (connections.length === config.connections.max) {
        if (config.connections.warn)
            console.warn('DBMS','DB Connections reached maximum limit.');
        return;
    }
    var connection = mysql.createConnection(config);
    connection.connect();
    connections.push(connection);
    available.push(connection);
};

// idle connection helper
var getIdleConnectionHelper = function(resolve, reject) {

    // don't provide a connection if the NODEJS service is going down
    if (goingDown)
        return;

    var connection = available.shift();

    // attempt to increase pool size
    if (! connection) {
        try {
            createConnection();
        } catch(e) {
            return reject(e);
        }
        connection = available.shift();
    }

    // return if we have one
    if (connection)
        return resolve(connection);

    // otherwise wait and retry
    setTimeout(function() {
        getIdleConnectionHelper(resolve,reject);
    }, 50);
};

// get idle connection
var getIdleConnection = function() {

    return new Promise(function(resolve,reject) {
        getIdleConnectionHelper(resolve,reject);
    });
};

// query helper
var queryHelper = function(connection, sql) {

    return new Promise(function(resolve,reject) {
        connection.query(sql, function(e,r) {
            if (e)
                return reject(e);
            return resolve(r);
        });
    });
};

// register cleanup on exit
process.stdin.resume();
var releaseConnections = function () {

    try {
        connections.forEach(function(connection) {
            connection.destroy();
        });
    } catch(e) {
        console.error('DBMS', e);
    }
    process.exit();
};

process.on('SIGINT', releaseConnections);
process.on('SIGQUIT', function() {
    goingDown = true;
});
process.on('uncaughtException', releaseConnections);

// connection recycle helper
var recycleConnection = function(connection) {

    available.push(connection);
    if (goingDown && available.length === connection.length)
        releaseConnections();
};


// export
module.exports = {

    format : mysql.format,

    transaction : function(queries) {

        return getIdleConnection().then(function(connection) {
            return queryHelper(connection,'START TRANSACTION').then(function() {
                return queries.reduce(function(query) {
                    var sql = query instanceof Array? mysql.format(query[0],query[1]) : query;
                    return queryHelper(connection, sql);
                }, Promise.resolve()).then(function() {
                    return queryHelper(connection, 'COMMIT').catch(function(error) {
                        return queryHelper(connection, 'ROLLBACK').then(function() {
                            throw error;
                        }).catch(function(rollbackError) {
                            throw { origError:error, rollbackError:rollbackError };
                        });
                    });
                });
            }).then(function (result) {
                recycleConnection(connection);
                return result;
            }).catch(function(error) {
                recycleConnection(connection);
                throw error;
            });
        });
    },

    query : function(sql,embed) {

        if (embed)
            sql = mysql.format(sql,embed);
        return getIdleConnection().then(function(connection) {
            return queryHelper(connection,sql).then(function (result) {
                recycleConnection(connection);
                return result;
            }).catch(function(error) {
                recycleConnection(connection);
                throw error;
            });
        });
    }

};
