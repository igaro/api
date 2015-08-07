"use strict";

var config          = require("../config.js");

module.exports = function (app) {

    var server = app.listen(config.service.port || 80, function() {
        console.info('Igaro API: Listening on port %d', server.address().port);
    });

};
