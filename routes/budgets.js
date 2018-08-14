var express = require('express');
var router = express.Router();
var Budget = require('../models/budget');
var middleware = require('../middleware');

router.post('/', middleware.isGovLoggedIn, function(req, res){

	var amDiff = (((parseInt(req.body.total)/100)*10) - req.body.amountSpent).toString(10);
	var ministryName = req.user.departmentName;

	if(req.body.ministry){
		ministryName = req.body.ministry;
	}

	var newBudget = {
		ministry: ministryName,
		total: req.body.total,
		year: req.body.year,
		amountSpent: req.body.amountSpent,
		amountDifference: amDiff
	}

	Budget.create(newBudget, function(err, newBudget){
		if(err){
			console.log(err);
		}else{
			res.redirect('/landing/ministry');
		}
	})
}) 

router.get('/new',middleware.isGovLoggedIn, function(req, res){
	res.render('budgets/new');
});

router.get('/show', middleware.isLoggedIn, function(req, res){
	Budget.distinct("ministry", function(err, ministries){
		res.render('budgets/show', {ministries : ministries});	
	})
	
});

router.post('/detailed', middleware.isLoggedIn, function(req, res){

	if(!(req.body)){
		req.flash("error", "No budget record found for that year");
		res.redirect('back');	
	}else{
		var yr = req.body.year.toString();
		var min = req.body.ministry.toString();
	}
	// if(yr === "All"){
	// 	var budgetObject;
	// 	Budget.find({"ministry" : min}, function(err, foundBudget){
	// 		for(var i =0; i<foundBudget.length; i++)
	// 		{
	// 			budgetObject[i] =
	// 				{
	// 					ministry : foundBudget[i].ministry,
	// 					total : foundBudget[i].total,
	// 					year : foundBudget[i].year,
	// 					amountSpent : foundBudget[i].amountSpent,
	// 					amountDifference : foundBudget[i].amountDifference
	// 				}
	// 		}
	// 		console.log(budgetObject)
	// 		res.render('budgets/details', {budget : budgetObject, query : yr});
	// 	})
	// }

	Budget.find({"year" : yr, "ministry" : min}, function(err, foundBudget){
		// console.log(foundBudget);

		if(err || foundBudget[0] === undefined){
			req.flash("error", "No budget found for that year");
			res.redirect('back');
		}else { 
			let budgetObject = {
				ministry : foundBudget[0].ministry,
				total : foundBudget[0].total,
				year : foundBudget[0].year,
				amountSpent : foundBudget[0].amountSpent,
				amountDifference : foundBudget[0].amountDifference
			}

			// console.log(budgetObject);

			res.render('budgets/details', {budget : budgetObject, query : yr});
		}
	})
});


module.exports = router;