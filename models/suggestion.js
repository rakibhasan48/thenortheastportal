var mongoose = require('mongoose');

var suggestionSchema = new mongoose.Schema({
	title : String,
	text : String,
    image : String,
    ministry : String,
	author : {
    		id: {
    			type : mongoose.Schema.Types.ObjectId,
    			ref:"User"
    		},   
    		username: String	
    	},
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Suggestion', suggestionSchema);