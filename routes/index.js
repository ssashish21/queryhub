var express = require("express"),
    router  = express.Router(),
    User    = require("../models/user"),
    passport = require("passport");

//Root Routes
router.get("/", function(req, res){
    res.render("landing");
});

//===================
//AUTH ROUTES
//===================

//show register form
router.get("/register",function(req,res){
    res.render("register");
});

//handle sign up logic
router.post("/register",function(req,res){
    var newUser=new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message); 
            res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to queryHub"+ user.username);
            res.redirect("/blogs");
        });
    });
});

//show login form
router.get("/login",function(req,res){
    res.render("login");
});

//handling login logic
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/blogs",
        failureRedirect:"/login"
    }),
    function(req,res){
});

//logic for logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged You Out!");
    res.redirect("/blogs");
});

module.exports = router;