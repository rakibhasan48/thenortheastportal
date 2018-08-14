var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    	text: String,
    	reply: String,
    	author : {
    		id: {
    			type : mongoose.Schema.Types.ObjectId,
    			ref:"User"
    		},   
    		username: String	
    	},
    	updated: { type: Date, default: Date.now }, 
});

module.exports =  mongoose.model("Comment", commentSchema);