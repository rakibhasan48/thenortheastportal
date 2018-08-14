const express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    flash           = require('connect-flash'),
    mongoose        = require('mongoose'),
    Project         = require('./models/project'),
    Comment         = require('./models/comment'),
    Rating          = require('./models/rating'),
    Ministry        = require('./models/ministry'),
    Suggestion      = require('./models/suggestion'),
    MinistryKey     = require('./models/ministryKey'),
    State           = require('./models/states'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    User            = require('./models/user'),
    request         = require('request');
    methodOverride  = require('method-override');
    keys            = require('./config/keys');
    session         = require('express-session');
    helmet          = require('helmet');
    MongoStore      = require('connect-mongo')(session);
    seedModoner     = require('./config/seedModoner');


//requiring routes
var commentRoutes       = require('./routes/comments'),    
    projectRoutes       = require('./routes/projects'),
    indexRoutes         = require('./routes/index'),
    ministryRoutes      = require('./routes/ministries'),
    suggestionRoutes    = require('./routes/suggestions'),  
    stateRoutes         = require('./routes/states'),
    budgetRoutes        = require('./routes/budgets');           

mongoose.connect(keys.db_address, { useMongoClient: true }); 

//express session
app.use(session({
    secret : "Sessionals suck",
    name : "sessionId",
    store : new MongoStore({mongooseConnection : mongoose.connection}),
    resave : false,
    saveUninitialized : false    
}));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');
app.use(flash());
app.use(helmet());

seedModoner();  //seed the database

//Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passing currentuser data to every route
var pr;
var projectPostedBy;

Project.find({}, function(err, projects){
    if(err){
        console.log("Something went wrong!");
    }else{
        pr = projects;
    }
});

Project.distinct("ministryName", function(err, ministryNames){
    if(err){
        console.error(err);
    }else{
        projectPostedBy = ministryNames; 
    }    
})

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.projects = pr;
    res.locals.projectPostedBy = projectPostedBy;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



app.use("/", indexRoutes);
app.use("/projects", projectRoutes);
app.use("/projects/:id/comments", commentRoutes);
app.use('/ministry', ministryRoutes);
app.use('/suggestions', suggestionRoutes);
app.use('/states', stateRoutes);
app.use('/budgets', budgetRoutes);


app.use(function(req, res) {
    res.status(400);
    res.render('error', {code : "404 Not found"});
  });

app.use(function(err, req, res, next){
    // console.error(err);
    res.status(500);
    res.render('error', {code : "500 Internal Server Error"});
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Deployed");
});
