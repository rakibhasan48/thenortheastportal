var express = require('express');
var request = require('request');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Project = require('../models/project');
var MinistryKey = require('../models/ministryKey');
var middleware = require('../middleware');
const nodemailer = require('nodemailer');
var keys = require('../config/keys');


function sendMail(email, token, host, userID, mode){

    return new Promise((resolve, reject) => {

        let transporterObject = {
            auth: {
                user: keys.email.user,   
                pass: keys.email.password
            }
        }

        if(keys.email.mailingService.length > 1){
            transporterObject.service = keys.email.mailingService;
        }else if(keys.email.host.length > 1){
            transporterObject.host = keys.email.host;
            transporterObject.port = 587;    
        }

        let transporter = nodemailer.createTransport(transporterObject);

        let mailOptions = {
            from: `"TheNorthEastPortal" <${keys.email.user}>`, // sender address
            to: email, // list of receivers
            subject: 'Verify your account', // Subject line
            //text: '', // plain text body
            html: `<b>Please verify your account by clicking the following link</b><br>
                    <a href="http://${host}/verify/${mode}/${userID}/${token}">http://${host}/verify/${mode}/${userID}/${token}</a>` // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(new Error(error)); 
            }
            else{
                var msg = 'Message sent: ' + info.messageId;
                resolve(msg);
            }
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });  

} 

let rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};


function updateToken(mode, user_id){
    let updatedToken = rand() + rand();

    User.findByIdAndUpdate(user_id, {$set:{[mode] : updatedToken}}, function(err, user){
        if(err){
            // updatedToken(mode, user_id);
        }else{
            //console.log("successfully updated token!");
        }
    })
}


//root route
router.get('/', function(req, res){
    Project.find({}, function(err, projects){
        if(err){
            console.log("Something went wrong!");
        }else{
            res.render("landing", {projects : projects});
        }
    });
});

router.get('/landing/ministry', function(req, res){
    res.render('ministryLanding');
});

router.get('/about', function(req, res){
    res.render('about')
})

router.get('/contact', function(req, res){
    res.render('contact')
})

router.get('/report/:id', middleware.isGovLoggedIn, function(req, res){

    Project.findById(req.params.id).populate('comments author.id').exec(function(err, foundProject){

        User.findById(foundProject.author.id, function(err, author){
            let data = {
                project : foundProject.title,
                ministry : foundProject.ministryName,
                email : author.email,
            }   

            let commentText = [];
            let commentDate = [];

            foundProject.comments.forEach(function(comment){
                commentText.push(comment.text);
                commentDate.push(comment.updated);
            });

            data.comments = commentText;
            data.time_stamp = commentDate; 

            dataObj = JSON.stringify(data);

            let username = keys.api.username;
            let password = keys.api.password;

            var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64'); 
            
            request({url : keys.api.route, 
                headers:{"Authorization" : auth},
                method : "POST", json : dataObj}, function(err, response, body){
                if(err)
                    console.log(err);
                // console.log(res && res.statusCode);
                // console.log(body);
                res.json(body);
            });
        })
    })
})
//============
//AUTH Routes
//============

//Show user signup form
router.get('/register/user', function(req, res){
    res.render('register');
});



//user register logic
router.post('/register/user', function(req,res){

    let token = rand() + rand();

    let newUser = new User({
        firstName : req.body.fName,
        lastName : req.body.lName,
        username : req.body.username,
        email : req.body.email,
        //aadharId : req.body.aadhar,
        role : "User",
        emailToken : token,
        isVerified : false
    });

    User.find({"email" : newUser.email}, function(err, emailExists){
        if(err){
            req.flash('error', "Something went wrong! Try again");
            res.redirect('/register/user');    
        }

        // console.log("users : ",emailExists);

        if(emailExists.length > 0){
            req.flash('error', "A user with that email already exists");
            res.redirect('/register/user');    
        }else{

            User.register(newUser, req.body.password, function(err, user){
                if(err){
                    req.flash('error', err.message);
                    res.redirect('/register/user');
                }else{
                    passport.authenticate('local')(req, res, function(){
                        req.flash("success", "Welcome to The North East Portal. Please wait a few minutes and verify your account by clicking the link sent to your mail");
                        res.redirect('/');

                        sendMail(user.email, user.emailToken, req.get('host'), user._id, "email").then((msg) => {
                            console.log(msg);
                            
                        }, (error) => {
                            console.error(error);
                        });

                               
                    });
                }
            });

        }
    })
       
});


//show gov signup form
router.get('/register/gov', function(req, res){
    res.render('register_gov');
});

//gov register logic
router.post('/register/gov', function(req, res){
    var newGovUser = new User({
        username : req.body.username,
        email : req.body.email,
        departmentName : req.body.departmentName,
        key : req.body.ministryKey,
        role : "GovUser"
    });

    MinistryKey.find({departmentName : req.body.departmentName, key : req.body.ministryKey}, function(err, foundKey){
        if(foundKey.length > 0 && !foundKey[0].used){
            User.register(newGovUser, req.body.password, function(err, govUser){
                if(err){
                    req.flash('error', err.message);
                    res.redirect('register/gov');
                }else{
                    passport.authenticate('local')(req, res, function(){
                        req.flash("success", "Welcome " + govUser.departmentName);
                        res.redirect('/landing/ministry');
                    });

                    MinistryKey.findOneAndUpdate({departmentName : req.body.departmentName, key : req.body.ministryKey}, {used : true}, function(err, updated){
                        console.log("updated condition");
                    })

                }
            });    
        }else{
            req.flash('error', "Enter a valid ministry key!");
            res.redirect('/register/gov');    
        }
    })

    
});

//user login route
router.get('/login/user', function(req, res){
    res.render('login_user');
});

router.post('/login/user', passport.authenticate('local', 
    {
        failureRedirect : '/login/user',
        failureFlash: true
    }), function(req, res){
        req.flash("success", "Successfully logged you in!");
        res.redirect("/");
});

//gov login route
router.get('/login/gov', function(req, res){
    res.render('login_gov');
});

router.post('/login/gov', passport.authenticate('local', 
    {
        successRedirect : '/landing/ministry',
        failureRedirect : '/login/gov'
    }), function(req, res){

});

//logout route
router.get('/logout', function(req, res){
    req.logout();
    req.flash("success", "Successfully Logged You Out!");
    res.redirect('/');
}); 


//email verification route
router.get('/verify/email/:id/:token', function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            req.flash("error", "Invalid Request");
            res.redirect('/');
        }else{
            // console.log(user);
            if(user.isVerified){
                req.flash("success", "You are already verified!");
                res.redirect('/');    
            }else{
                if(req.params.token == user.emailToken){
                    User.findByIdAndUpdate(user._id, {$set:{isVerified:true}}, function(err, verifiedUser){
                        if(err){
                            req.flash("error", "Something went wrong, try again");
                            res.redirect('/');    
                        }
                        //console.log(verifiedUser);
                        req.flash("success", "You have beeen successfully verified!");
                        res.redirect('/');
                        updateToken("emailToken", user._id);
                    })    
                }else{
                    req.flash("error", "Invalid token or expired");
                    res.redirect('/');
                }
            }
        }
    })
});

router.get('/verify/resend/', function(req, res){
    req.flash("success", "Verification mail will be resent. Please check your mail in a few minutes.");
    res.redirect('/');

    sendMail(req.user.email, req.user.emailToken, req.get('host'), req.user._id, "email").then((msg) => {
        console.log(msg);
        
    }, (error) => {
        console.error(error);
    });
    // console.log(req.user);
});

// password verification routes

router.post('/verify/password/', function(req, res){
    User.find({email : req.body.email}, function(err, foundUser){
        // console.log("user" ,foundUser);

        if(foundUser.length > 0){
            let pass_token = rand() + rand();

            User.findByIdAndUpdate(foundUser[0]._id, {$set:{passToken:pass_token}}, function(err, user){
                if(err){
                    req.flash("error", "Something went wrong, try again!");
                    res.redirect('/verify/password');
                }else{

                    req.flash("success", "Password reset mail has been sent to your mail");
                    res.redirect('/');

                    sendMail(user.email, pass_token, req.get('host'), user._id, "password").then((msg) => {
                        console.log(msg);
                        
                    }, (error) => {
                            console.error(error);
                    });
                }    
            })    
        }else{
            req.flash("error", "No user found with that email!")
            res.redirect('/verify/password');
        }

        
    })
})

router.get('/verify/password/', function(req, res){
    res.render('forgot_password');
});

router.get('/verify/password/:id/:token', function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            req.flash("error", "Invalid Request");
            res.redirect('/');
        }else{
            // console.log(user);
            if(req.params.token == user.passToken){
                res.render('update_password', {targetUser : user});    
            }else{
                req.flash("error", "Invalid token or expired");
                res.redirect('/');
            }
        }
    })    
})

// router.get('/verify/password/update', function(req, res){
//     res.render('update_password');
// });

router.post('/verify/password_update', function(req, res){
    User.findById(req.body.id, function(err, user){
        if(err){
            req.flash("error", "Invalid Request");
            res.redirect('back');
        }else{
            user.setPassword(req.body.password, function(){
                user.save();
                req.flash('success', "Password reset successfully!");
                res.redirect('/');
                updateToken("passToken", user._id);
            })
        }

    })
});

// Add ministry key
router.get('/add/key', middleware.isMoDonerLoggedIn, function(req, res){
    res.render('addKey');
})

router.post('/add/key', middleware.isMoDonerLoggedIn, function(req, res){

    let newKey = {
        departmentName : req.body.department,
        key : req.body.key
    }

    MinistryKey.create(newKey, function(err, created){
        if(err){
            res.redirect('back');
            req.flash('error', "Could not create key");
        }else{
            req.flash('success', "Successfully created key");
            res.redirect('/landing/ministry');
        }
    })

})

module.exports = router;
















