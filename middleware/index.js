//all the middleware goes here

var Project = require('../models/project');
var Comment = require('../models/comment');
var request = require('request');
var keys = require('../config/keys');

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
            
        return next();
    }   
    else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect('back');
    }
}

middlewareObj.checkProjectOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Project.findById(req.params.id, function(err, foundProject){
            if(err){
                req.flash("error", "Project not found");
                res.redirect("back");
            }else{
                if(foundProject.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("back");
    }  
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect('back');
            }else{
                if(foundComment){
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    }else{
                        req.flash("error", "You don't have permission to do that!")
                        res.send("Illegal");
                    }
                }
            }
        })
    } else{
        req.flash("error", "You need to be logged in to do that!");
        res.send("Illegal");
    }    
}

middlewareObj.isUserLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
            if(req.user.role === "User"){
             return next();   
         }else{
            req.flash("error", "Only Public users can do that!");
            //res.redirect('back');
            res.send("Illegal");
         }
    }else{
        req.flash("error", "You need to be logged in to do that!");
        res.send('Illegal');
    }
}

middlewareObj.isUserLoggedInComment = function(req, res, next){
    if(req.isAuthenticated()){
            if(req.user.role === "User"){
             return next();   
         }else{
            //req.flash("error", "Only Public users can do that!");
            //res.redirect('back');
            res.json("Illegal");
         }
    }else{
        //req.flash("error", "You need to be logged in to do that!");
        res.json('Illegal');
    }
}

middlewareObj.isGovLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
         if(req.user.role === 'GovUser'){
            return next();
        }else{
            req.flash("error", "You Don't Have Permission To Do That!");
            res.redirect('back');
        }   
    }else{
        req.flash("error", "You Don't Have Permission To Do That!");
        res.redirect('back');
    }
}

middlewareObj.isMoDonerLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
         if(req.user.role === 'GovUser'){
            if(req.user.username === 'modoner'){
                return next();   
            }
            
        }else{
            req.flash("error", "You Don't Have Permission To Do That!");
            res.redirect('back');
        }   
    }else{
        req.flash("error", "You Don't Have Permission To Do That!");
        res.redirect('back');
    }
}

middlewareObj.checkComment = function(req, res, next){
    var commentText = req.body.comment.text;

    let data = {
        text : commentText
    }

    let username = keys.api.username;
    let password = keys.api.password;

    var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

    request({url : keys.api.route_abuse, 
        headers:{"Authorization" : auth},
        method : "POST", json : JSON.stringify(data)}, 
        function(err, response, body){
            if(err)
                console.log(err);
            //console.log(res && res.statusCode);
            // console.log("Abuse ", body);
            // res.json(body);

            if(body.result){
                res.json("Abuse");
            }else{
                return next();    
            }

        
        // if(body)
    });
}

middlewareObj.isVerified = function(req, res, next){
    if(!req.user.isVerified){
        req.flash("error", "Please verify account via email first!");
        res.redirect('back');
    }else{
        return next();
    }
}

middlewareObj.isVerifiedComment = function(req, res, next){
    if(!req.user.isVerified){
        res.json('IllegalVerify');
    }else{
        return next();
    }
}


module.exports = middlewareObj;