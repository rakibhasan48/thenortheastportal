var mongoose = require('mongoose');

var budgetSchema = new mongoose.Schema({
	ministry : String,
	total : String,
	year : String,
	amountSpent : String,
	amountNER : String,
	amountDifference : String
});

module.exports = mongoose.model("Budget", budgetSchema); 

