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







