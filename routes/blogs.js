var express      = require("express"),
    router       = express.Router(),
    Blog         = require("../models/blog"),
    Comment      = require("../models/comment"),
    middleware   = require("../middleware");

//INDEX- show all blogs.
router.get("/", function(req,res){
    Blog.find({},function(err,allBlogs){
        if(err){
            console.log(err);
        }else{
            res.render("blogs/index",{blogs: allBlogs});
        }
    }); 
});
//CREATE-add new Blog
router.post("/",middleware.isLoggedIn,function(req,res){
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var data = {
        name: req.body.name,
        description:req.body.description,
        author: author
    } 
    Blog.create(data,function(err,blog){
        if(err){
            console.log(err);

        }else{
            console.log(blog);
            res.redirect("/blogs");
        }
    });
});
//NEW-show from to create a new Blog.
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("blogs/new");
});

//SHOW- show more info about one Blog.
router.get("/:id",function(req,res){
    Blog.findById(req.params.id).populate("comments").exec(
        function(err,foundBlog){
            if(err || !foundBlog){
                console.log(err);
                req.flash("error","Blog not found");
                res.redirect("back");
            }else{
                res.render("blogs/show",{blog:foundBlog});
            }
    });
});

//Edit Blog Route
router.get("/:id/edit",middleware.checkBlogOwnership,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("back");
        }else{
            res.render("blogs/edit",{blog:foundBlog});
        }
    }); 
});

//Update Blog Route
router.put("/:id",middleware.checkBlogOwnership,function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.Blog,function(err,updatedBlog){
        if(err){
            console.log(err);
        }else{
            req.flash("success","Successfully updatd Blog");
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//Destroy Blog Routes
router.delete("/:id",middleware.checkBlogOwnership,function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
});

module.exports = router;