var mongoose = require('mongoose');


var projectSchema = new mongoose.Schema({
    title : String,
    ministryName: String,
    image: String,
    head : String,
    budget: String,
    startDate : String,
    endDate : String,
    percentage : String,
    description: String,
    author: {
    	id: {
	    	type: mongoose.Schema.Types.ObjectId,
	    	ref: "User"
    	},
    	username : String
    },

    comments : [{
    	type : mongoose.Schema.Types.ObjectId,
    	ref  : 'Comment'
    }],

    ratings : [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Rating'
    }] 
});

module.exports =  mongoose.model("Project", projectSchema);