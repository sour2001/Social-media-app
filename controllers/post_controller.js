const Post=require('../models/post');
const Comment=require('../models/comment');

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

module.exports.destroy=function(req,res){
    Post.findById(req.params.id).then(function(post){
        if(post.user==req.user.id){
            post.deleteOne();


            Comment.deleteMany({post:req.params.id}).then(function(){
                return res.redirect('back');
            }
            ).catch(function(err){
                console.log(err);
                return;
            }
            );
        }
        else{
            return res.redirect('back');
        }
    }
    ).catch(function(err){
        console.log(err);
        return;
    }
    );
}

  
    

