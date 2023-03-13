const Post = require('../models/post');
const user = require('../models/user');

module.exports.home = function(req, res) {
  //console.log(req.cookies);
  //res.cookie('user_id', 25);

   //populate the user of each post
    //removed after populate of user in post
    // Post.find({}).then(function(posts){
    //     return res.render('home',{
    //         title:"Codeial || Home",
    //         posts:posts
    //     });
    //   });

  Post.find({})
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user'
      }
    })
    
    .exec()
    .then(posts => {
      return res.render('home', {
        title: 'Codeial || Home',
        posts: posts
      });
    })
    .catch(err => {
      console.log(err);
      return;
    });
}
