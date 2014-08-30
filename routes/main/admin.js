var Router = require("../../lib/Router.js");

module.exports = function(app) {

	var self = this;

	var router = new Router(app);

	this.meta = function() {
		return {
			id : 'admin',
			name : {
				en : 'Administration'
			},
			desc : {
				en : 'Elevated security functionality'
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

};