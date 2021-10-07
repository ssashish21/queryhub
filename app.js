var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    flash                   = require("express-flash"),
    methodOverride          = require("method-override"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    Blog                    = require("./models/blog"),
    User                    = require("./models/user"),
    Comment                 = require("./models/comment");

const PORT = process.env.PORT || 3030;

//requiring Routes
var blogRoutes       = require("./routes/blogs");
var commentRoutes    = require("./routes/comments");
var indexRoutes      = require("./routes/index");

mongoose.set('useFindAndModify',false);
mongoose.set('useUnifiedTopology',true);
mongoose.connect("mongodb://localhost:27017/queryHub",{useNewUrlParser:true});

// seedDB(); //seed the databse
app.use(flash());
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();
});
///===================//


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));


//ROUTES
app.use("/blogs",blogRoutes);
app.use("/blogs/:id/comments",commentRoutes);
app.use("/",indexRoutes);

//------------------------------------/
app.get("*", function(req,res){
    res.send("404: Page Not Found");
});

app.listen(PORT, function(){
    console.log(`App is Started at port:${PORT}`);
});
