const Post=require('../models/post');

module.exports.create=function(req,res){
    if(req.isAuthenticated()){
        Post.create({
            content:req.body.content,
            user:req.user._id
        }).then(function(post){
            return res.redirect('back');
        }
        ).catch(function(err){
            console.log(err);
            return;
        }
        );
    }
    else{
        return res.redirect('/users/sign-in');
    }
}
    

