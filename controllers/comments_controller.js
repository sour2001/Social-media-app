const Post = require('../models/post');
const Comment = require('../models/comment');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');





module.exports.create = async function(req, res) {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      post.comments.push(comment);
      await post.save();
      comment = await Comment.findById(comment._id).populate('user', 'name email');
      //commentsMailer.newComment(comment);
        let job = queue.create('emails', comment).save(function(err) {
        if (err) {
            console.log('error in creating a queue', err);
            return;
        }
        console.log('job enqueued', job.id);
    });


      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: comment
          },
          message: 'Comment created!',
        });
      }
      req.flash('success', 'Comment Published!');
      return res.redirect('/');
    }
  } catch (err) {
    req.flash('error', err.message);
    console.error(err);
    return res.redirect('back');
  }
};

module.exports.destroy = async function(req, res) {
  try {
    let comment = await Comment.findById(req.params.id);
    if (comment.user == req.user.id) {
      let postId = comment.post;
      comment.deleteOne();

      let post = await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});

      await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: 'Comment deleted!',
        });
      }
      req.flash('success', 'Comment deleted!');
      return res.redirect('back');
    } else {
      req.flash('error', 'Unauthorized');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', err.message);
    console.error(err);
    return res.redirect('back');
  }
};


