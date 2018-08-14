var mongoose = require('mongoose');

var ministryKeySchema = new mongoose.Schema({
	departmentName : String,
	key : String,
	used : false
});

module.exports = mongoose.model("MinistryKey", ministryKeySchema); 

