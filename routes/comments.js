var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Blog        = require("../models/blog"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//Add Comments
router.get("/new",middleware.isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err || !foundBlog){
            console.log(err);
            req.flash("error","Blog/Query not found");
            res.redirect("back");
        }else{
            res.render("comments/new",{blog:foundBlog});
        }
    });
});

//Comments insertion to show page
router.post("/",middleware.isLoggedIn,function(req,res){
    //look up Blog using id
    //create a new comment
    //connect new comment to Blog
    //redirect to Blog show page
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){ 
            console.log(err);
            req.flash("error","Something went wrong");
            res.redirect("back");
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username =  req.user.username;
                    comment.save(); 
                    console.log(comment);
                    //save comment
                    foundBlog.comments.push(comment);
                    foundBlog.save();
                    req.flash("success","Successfully added Response");
                    res.redirect("/blogs/"+req.params.id);
                }
            });
        }
    });
});

// /blogs/:id/comments/:comment_id/edit
//Edit comments
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err || !foundBlog){
            req.flash("error","No Blog found");
            return res.redirect("/blogs");
        }else{
            Comment.findById(req.params.comment_id,function(err,comment){
                if(err || !comment){
                    console.log(err);
                    req.flash("error","No Response found")
                    res.redirect("back");
                }else{
                    res.render("comments/edit",{Blog_id:req.params.id,comment:comment});
                }
            });
        }
    });
    
});

//Update Comment
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            console.log(err);
            req.flash("error","Something went wrong");
            res.redirect("back");
        }else{
            console.log(updatedComment);
            req.flash("success","Response updated");
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//Destroy Comment
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            req.flash("error","Something went wrong");
            res.redirect("back");
        }else{
            req.flash("success","Response deleted successfully");
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

module.exports = router;