var mongoose = require('mongoose');

var ministrySchema = new mongoose.Schema({
	title : String,
	image : String,
	link : String,
	minister : String,
	ministerOfState : String,
	headquarter : String,
	description : String,
	projects : [{
		type : mongoose.Schema.Types.ObjectId,
    	ref  : 'Project'
	}],
	programs : {
		title: String,
		image : String,
		status : String,
		description : String
	}
}, {
	collection : 'ministry'
});

module.exports = mongoose.model('Ministry', ministrySchema);