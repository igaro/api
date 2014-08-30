
var mongodb = require("mongodb");
var config = require("../etc/config.json").mongodb;

module.exports = {

	connection : mongodb.connect('mongodb://'+config.user+':'+config.password+'@'+config.host + ':' + config.port, [config.collection], function(err) {
		if (err) console.log(err);
	})
	
};