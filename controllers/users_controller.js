const User = require('../models/user');

module.exports.Profile= function(req,res) {
    
    return res.render('user_profile',{
        title:"Users Page"
    });
}

module.exports.signIn= function(req,res) {
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title:"Sign In Page"

    });
}

module.exports.signUp= function(req,res) {
   if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
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
    return res.redirect('/');
}

module.exports.destroySession= function(req,res,next) {
    req.logout(function(err){
        if(err){
            console.log(err);
            return;
        }
        return res.redirect('/');
    });
}

