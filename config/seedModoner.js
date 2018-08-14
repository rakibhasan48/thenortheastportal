let User = require('../models/user');
let keys = require('./keys');

module.exports = function(){
	User.find({"username" : "modoner"}, function(err, foundModoner){
		if(err){
            console.log("Seeding error", err);    
        }

		if(foundModoner.length > 0){
			foundModoner[0].setPassword(keys.modonerUser.pass, function(){
                foundModoner[0].save();
            });
		}else{
			let newGovUser = new User({
		        username : "modoner",
		        email : keys.modonerUser.email,
		        departmentName : keys.modonerUser.departmentName,
		        role : "GovUser"
		    });

			User.register(newGovUser, keys.modonerUser.pass, function(err, modonerUser){
				//console.log("successfully initialized modoner user");
			})
		}
	})
}
