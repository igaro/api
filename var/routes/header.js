var Route = require("../../lib/Route.js");
var filename = __filename.split('/').slice(-1)[0];
var route = new Route(filename);

module.exports = function(app,req,res) {

    "use strict";

    return Promise.resolve().then(function() {

        var model = {};

        return res.json({
            css:route.css,
            js:route.view,
            model:model
        });

        return route.exec.apply(app,req,res);

    });

};


