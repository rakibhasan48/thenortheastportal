var express = require('express');
var router = express.Router();
var Suggestion = require('../models/suggestion');
var middleware = require('../middleware');

router.get('/', function(req, res){
	Suggestion.find({}, function(err, suggestions){
		if(err){
			console.error(err);
		}else{
			res.render("suggestions/index", {suggestions : suggestions});
		}
	});
});

router.post('/', middleware.isUserLoggedIn, middleware.isVerified, function(req, res){
	Suggestion.create(req.body.suggestion, function(err, newSuggestion){
		if(err){
			console.error(err);
		}else{
			res.redirect('/suggestions');
		}
	});
});

router.get('/new', middleware.isUserLoggedIn, middleware.isVerified, function(req,res){
	res.render('suggestions/new');
})

module.exports = router; 



