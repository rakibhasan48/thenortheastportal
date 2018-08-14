var express = require('express');
var router = express.Router({mergeParams : true});
var Project = require('../models/project');
var Comment = require('../models/comment');
var Rating = require('../models/rating');
var request = require('request');
var middleware = require('../middleware'); 

// //new comment
// router.get('/new', middleware.isLoggedIn, function(req, res){
//     Project.findById(req.params.id, function(err, project){
//         if(err){
//             console.error(err);
//         }else{
//             res.render('comments/new', {project : project});              
//         }
//     });
  
// });

//create comment
router.post('/', middleware.isUserLoggedInComment, middleware.isVerifiedComment, middleware.checkComment, function(req, res){
    Project.findById(req.params.id, function(err, project){
        if(err){
            console.error(err);
            res.redirect('/projects')
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    //req.flash("error", "Something went wrong!")
                    res.json("Illegal");
                    console.error(err);
                }

                //associating comment with user 
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();

                //adding comment to main db
                project.comments.push(comment);
                project.save();
                //req.flash("success", "Posted Successfully!")
                // res.redirect('/projects/' + project._id);
                // console.log(comment.text);
                res.json(comment);
                // console.log(comment);
            });    
        }
    });
});

router.put('/reply/:comment_id/', middleware.isGovLoggedIn, middleware.isVerifiedComment, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            console.error(err);
            res.redirect('/projects')
        }
        // else{
        //     Comment.create(req.body.comment, function(err, comment){
        //         if(err){
        //             req.flash("error", "Something went wrong!")
        //             console.error(err);
        //         }else{
        //             //associating comment with user 
        //             comment.author.id = req.user._id;
        //             comment.author.username = req.user.username;
        //             comment.save();

        //             //adding comment to main db
        //             project.comments.push(comment);
        //             project.save();
        //             req.flash("success", "Posted Successfully!")
        //             // res.redirect('/projects/' + project._id);
        //             res.json(comment);
        //         }
        //     });    
        // }
        else{
            res.json(comment);
        }
    });    
})

//post rating
router.post('/rating', middleware.isUserLoggedIn, middleware.isVerifiedComment, function(req, res){
    Project.findById(req.params.id, function(err, project){
        if(err){
            console.error(err);
            res.redirect('/projects')
        }else{
            Rating.create(req.body.star, function(err, rating){
                if(err){
                    req.flash("error", "Something went wrong!")
                    console.error(err);
                }else{
                    rating.author.id = req.user._id;
                    rating.author.username = req.user.username;
                    rating.save();

                    project.ratings.push(rating);
                    project.save();
                    req.flash("success", "Successfully Rated!");
                    res.redirect('/projects/' + project._id);
                }
            })
        }
    })
})

//Edit comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.render("back");
        }else{
            res.render('comments/edit', {project_id:req.params.id, comment:foundComment})
        }
    })

});

//Update comment
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.render("back");
        }else{
            res.redirect('/projects/'+req.params.id);
        }
    })
});

//Delete route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.render('back');
        }else{
            req.flash("success", "Comment Deleted!!");
            console.log("delete");
            //res.redirect('/projects/' + req.params.id);
            res.send("Comment Deleted!");
        }
    })
})

//middelware



module.exports = router;