var express = require('express');
var router = express.Router();
var Project = require('../models/project');
var middleware = require('../middleware');
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();
var AWS = require('aws-sdk');

var keys = require('../config/keys');

var fs = require('fs'),
    S3FS = require('s3fs'),
    s3fsImpl = new S3FS(keys.aws.bucket, {
        region : keys.aws.region,
        accessKeyId : keys.aws.s3AccessKey,
        secretAccessKey : keys.aws.s3SecretAccessKey
    });

s3fsImpl.create().then((msg)=>{

}, (error) => {

});

router.use(multipartyMiddleware);

function uploadImg(file, userId, fileName){

    return new Promise((resolve, reject) => {

        let stream = fs.createReadStream(file.path);

        s3fsImpl.writeFile(fileName, stream, {ContentType : file.type}).then(function () {
            fs.unlink(file.path, function (err) {
                if (err) {
                    reject(new Error(err));
                }
            });
            resolve('file uploaded successfully!');
        });

    });

    //return fileName;
}

function deleteImg(filePath){
    if(filePath.length>1){
            var s3 = new AWS.S3({
            region : keys.aws.region,
            accessKeyId : keys.aws.s3AccessKey,
            secretAccessKey : keys.aws.s3SecretAccessKey    
            });
             
            s3.deleteObject({
                Bucket : keys.aws.bucket,
                Key : filePath,
            }, function(err, data){
                if(err){
                    console.error(err);
                }else{
                    //console.log(data, "successfully deleted");
                }
            })    
        }
}



//index route
router.get('/', function(req, res){

    Project.find({}).sort({_id : -1}).exec(function(err, projects){
        if(err){
            console.log("Something went wrong!");
        }else{
            res.render("projects/index", {projects : projects, num : 1});
        }
    });
});


router.get('/page/:num', function(req, res){

    Project.find({}).sort({_id : -1}).exec(function(err, projects){
        if(err){
            console.error(err);
        }else{
            res.render("projects/index", {projects : projects, num : req.params.num});
        }
    });
});

router.get('/page/ministry/:min', function(req, res){

    let min = req.params.min; 

    Project.find({"author.username" : min}).sort({_id : -1}).exec(function(err, projects){
        //console.log("project", projects);
        if(err){
            console.error(err);
        }else{
            res.render("projects/index", {projects : projects});
        }
    });
});

router.get('/page/sort/ministry/', function(req, res){

    let min = req.query.ministry; 

    Project.find({"ministryName" : min}).sort({_id : -1}).exec(function(err, projects){
        //console.log("project", projects);
        if(err){
            console.error(err);
        }else{
            res.render("projects/index", {projects : projects});
        }
    });
});

//create new post route
router.post('/', middleware.isGovLoggedIn, function(req, res){
    var fDate = req.body.start_date;
    var sDate = fDate.split("-");
    var beginDate = new Date(sDate[0], sDate[1] - 1, sDate[2]);

    var toDate = req.body.end_date;
    var eDate = toDate.split("-");
    var targetDate = new Date(eDate[0], eDate[1] - 1, eDate[2]);

    var totalTime = (targetDate - beginDate);
    var dateProgress = new Date() - beginDate;
    var completionPercentage = (Math.round((dateProgress / totalTime) * 100));

    var ministry = req.user.departmentName;

    if(req.body.ministry){
        ministry = req.body.ministry;
    } 

    //console.log("file : ", req.files);
    let extension = req.files.image_file.type.split('/')[1];
    let fileName = `${req.user._id}/${req.files.image_file.fieldName}-${Date.now()}.${extension}`;
    var imageUrl = `https://s3.ap-south-1.amazonaws.com/${keys.aws.bucket}/${fileName}`;

    var newProject = {
         title : req.body.title,
         ministryName : ministry,
         image : imageUrl,
         head : req.body.head,
         budget : req.body.budget,
         startDate : req.body.start_date,
         endDate : req.body.end_date,
         percentage : completionPercentage,
         description : req.body.description,
         author : {
             id: req.user._id,
             username: req.user.departmentName    
         }
    }   

    uploadImg(req.files.image_file, req.user._id, fileName).then((msg) => {
        Project.create(newProject, function(err, newProject){
            if(err){
                req.flash("error", "Could not add new project!")
            }else{
                req.flash("success", "Successfully added new project!");
                res.redirect('/projects');
            }
        });    
    }, (error) => {
        console.error(error);
    })

    
});

//page to write new post
router.get('/new', middleware.isGovLoggedIn, function(req, res){
   res.render('projects/new');
});

//show route
router.get('/:id', function(req, res){
    Project.findById(req.params.id).populate('comments').populate('ratings').exec(function(err, foundProject){
        if(err){
            console.error(err);
        }else{
            res.render('projects/show', {project : foundProject});
        }
    });
});

//EDIT route
router.get('/:id/edit', middleware.checkProjectOwnership, function(req, res){
    Project.findById(req.params.id, function(err, foundProject){
        if(err){
            req.flash("error", "Project not found");
        }
        res.render('projects/edit', {project:foundProject});
    })
;});

//UPDATE Route
router.put("/:id", middleware.checkProjectOwnership, function(req, res){

    let projectObj = req.body.project;

    let extension = req.files.image_file.type.split('/')[1];
    let fileName = `${req.user._id}/${req.files.image_file.fieldName}-${Date.now()}.${extension}`;
    var imageUrl = `https://s3.ap-south-1.amazonaws.com/${keys.aws.bucket}/${fileName}`;
    

    projectObj.image = imageUrl;

    Project.findById(req.params.id, function(err, foundProject){
        filePath = foundProject.image.split('https://s3.ap-south-1.amazonaws.com/modoner-test-bucket/')[1]; 
        deleteImg(filePath);
    });

    uploadImg(req.files.image_file, req.user._id, fileName).then((msg) => {

        Project.findByIdAndUpdate(req.params.id, projectObj, function(err, updatedPost){
            if(err){
                res.redirect('/projects');
            }else{
                res.redirect('/projects/' + req.params.id);
            }
        })

    }, (error) => {
            console.error(error);
        });
});

//Destroy Route
router.delete('/:id', middleware.checkProjectOwnership, function(req, res){
    var filePath = "";

    Project.findById(req.params.id, function(err, foundProject){
        filePath = foundProject.image.split('https://s3.ap-south-1.amazonaws.com/modoner-test-bucket/')[1]; 
        deleteImg(filePath);
    });

    Project.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/projects');
        }else{
            res.redirect('/projects');  
        }
    });

});  

//middelware




module.exports = router; 