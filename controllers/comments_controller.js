const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function(req, res) {
    Post.findById(req.body.post).then(function(post) {
        if (post) {
            //below line is used to create the comment in the database
            Comment.create({
                //below line is used to get the content from the form
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }).then(function(comment) {
                //below line is used to push the comment in the post
                post.comments.push(comment);
                //below line is used to save the post in the database
                post.save();

                res.redirect('/');
            }
            ).catch(function(err) {
                console.log(err);
                return;
            }
            );
        }
    }
    ).catch(function(err) {
        console.log(err);
        return;
    }
    );
}

module.exports.destroy = function(req, res) {
    Comment.findById(req.params.id).then(function(comment) {
        if (comment.user == req.user.id) {
           let postId = comment.post;
              comment.deleteOne();
              Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}}).then(function(post) {
                return res.redirect('back');
            }
            ).catch(function(err) {
                console.log(err);
                return;
            }
            );
        }
        else {
            return res.redirect('back');
        }
    }
    ).catch(function(err) {
        console.log(err);
        return;
    }
    );
}










