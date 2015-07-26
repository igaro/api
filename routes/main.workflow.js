var Router = require("../../lib/Router.js");
var Serve = require("../../lib/Serve.js");

module.exports = function(app) {

	var self = this;

	var router = new Router(app);
	var serve = new Serve(app);

	this.meta = function() {
		return {
			id : 'workflow',
			name : {
				en : 'Workflow'
			},
			desc : {
				en : 'Creation & editing of content and assets.'
			},
			hasAccess : self.hasAccess(),
			awareOnNoAccess : true,
			children : router.getChildren()
		};
	};

	this.hasAccess = function() {
		return true;
	};

	router.append('all', '', function(req, res, next) {
		if (self.hasAccess()) return next();
	});

	router.append('all', '', function(req, res, next) {
		res.json(self.meta());
	});

	serve.secure('', function(req, res, next) {
		if (self.hasAccess()) return next();
	});

};