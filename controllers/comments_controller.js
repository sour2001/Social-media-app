const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create =async function(req, res) {
    try {
    let post=await Post.findById(req.body.post);
        if (post) {
            //below line is used to create the comment in the database
            let comment=await Comment.create({
                //below line is used to get the content from the form
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            

                //below line is used to push the comment in the post
           
                post.comments.push(comment);
                //below line is used to save the post in the database
                post.save();
                if (req.xhr) {
                    return res.status(200).json({
                        data: {
                            comment: comment
                        },
                        message: "Comment created!"
                    });
                }

                req.flash('success', 'Comment Published!');

                res.redirect('/');
            }
        }
    catch(err) {
        req.flash('error', err);
        console.log(err);
        return;
    }
}


        

module.exports.destroy =async function(req, res) {
    try{
    let comment=await Comment.findById(req.params.id);
        if (comment.user == req.user.id) {
            
           let postId = comment.post;
           comment.deleteOne();

           let post=Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});
              if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }
            req.flash('success', 'Comment deleted!');
            return res.redirect('back');
        }
        else {
            req.flash('error', 'You cannot delete this comment!');
            return res.redirect('back');
        }
    }
    catch(err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}

        
    










