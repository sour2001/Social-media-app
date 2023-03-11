const User = require('../models/user');

// module.exports.Profile= function(req,res) {
//     return res.render('user_profile',{
//         title:"Users Page"
//     });
// }

//update the profile page to show the user details and ensure user is signed in
module.exports.Profile= function(req,res) {
    if(req.cookies.user_id){
    User.findById(req.cookies.user_id).then(function(user){
        return res.render('user_profile',{
            title:"Users Page",
            user:user
        });
    });
    }else{
        return res.redirect('/users/sign-in');
    }
}


module.exports.signIn= function(req,res) {
    return res.render('user_sign_in',{
        title:"Sign In Page"
    });
}

module.exports.signUp= function(req,res) {
    return res.render('user_sign_up',{
        title:"Sign Up Page"
    });
}

module.exports.create= function(req,res) {
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }
    
    User.findOne({email:req.body.email}).then(function(user){
        
        if(!user){
                 User.create(req.body).then(function(user){
                return res.redirect('/users/sign-in');
            });
        }else{
            return res.redirect('back');
        }
    }
    );
}

module.exports.createSession= function(req,res) {
    User.findOne({email:req.body.email}).then(function(user){
        if(user){
            if(user.password!=req.body.password){
                return res.redirect('back');
            }
            res.cookie('user_id',user.id);
            return res.redirect('/users/profile');
        }else{
            return res.redirect('back');
        }
    }
    );
}

module.exports.destroySession= function(req,res) {
    res.clearCookie('user_id');
    return res.redirect('/');
}



