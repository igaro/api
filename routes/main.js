var Router = require("../lib/Router.js");
var Serve = require("../lib/Serve.js");

module.exports = function(app) {

	var router = new Router(app);
	var serve = new Serve(app);

	var self = this;

	this.meta = function() {
		return {
			hasAccess : self.hasAccess(),
			awareOnNoAccess : true,
			children : router.getChildren()
		};
	};

	this.hasAccess = function() {
		return true;
	};

	// secure
	router.append('all', '', function(req, res, next) {
		if (self.hasAccess()) return next();
	});
	
	router.append('all', '', function(req, res, next) {
		res.json(self.meta());
	});

	serve.secure('', function(req, res, next) {
		if (self.hasAccess()) return next();
	});

	router.registerChildren();

};


