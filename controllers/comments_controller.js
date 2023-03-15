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
                req.flash('success', 'Comment Published!');
                post.comments.push(comment);
                //below line is used to save the post in the database
                post.save();

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
    let comment=await Comment.findById(req.params.id);
        if (comment.user == req.user.id) {
           let postId = comment.post;
           req.flash('success', 'Comment Deleted!');
              comment.deleteOne();
              Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}}).then(function(post) {
                return res.redirect('back');
            }
            );
        }
        else {
            req.flash('error', 'You cannot delete this comment!');
            return res.redirect('back');
        }
    }
    










