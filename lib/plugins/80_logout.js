"use strict";

module.exports = function(app) {

    app.get('/logout', function(req, res) {
        req.session.destroy(res.json);
        app.emit('session.destroy');
        res.sendStatus(200);
    });
};
