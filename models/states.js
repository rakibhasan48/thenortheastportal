var mongoose = require('mongoose');

var stateSchema = new mongoose.Schema({
	title : String,
	image : String,
	description : String,
	tag : String
 }, {
	collection : 'state'
});

module.exports = mongoose.model('State', stateSchema);