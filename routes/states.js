var express = require('express');
var router = express.Router();
var State = require('../models/states');
var Project = require('../models/project')
var middleware = require('../middleware');



router.get('/page/:state', function(req, res){
	let foundState = 'states/' + req.params.state;

	res.render(foundState);
})

router.get('/:id', function(req, res){
	State.findById(req.params.id, function(err, foundState){
		if(err){
			console.error(err);
		}else{
			res.render('states/show', {state : foundState});
		}
	})
})




module.exports = router;