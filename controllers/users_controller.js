const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req, res) {
    User.findById(req.params.id).then(function(user) {
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });
}

module.exports.update = async function(req, res) {
//     if(req.user.id == req.params.id) {
//         User.findByIdAndUpdate(req.params.id,req.body).then(function(user) {
//             req.flash('success','Profile Updated Successfully');
//             return res.redirect('back');
//         });
//     } else {
//         req.flash('error','Unauthorized');
//         return res.status(401).send('Unauthorized');

//     }
// }

// update after multer

if(req.user.id == req.params.id) {

    try {   
        let user = await User.findById(req.params.id);
        User.uploadedAvatar(req,res,function(err){
            if(err){
                console.log('*****Multer Error: ',err);
            }
            user.name=req.body.name;
            user.email=req.body.email;
            if(req.file){
                if(user.avatar){
                    User.avatarPath+'/'+user.avatar;
                }

                // this is saving the path of the uploaded file into the avatar field in the user
                user.avatar=User.avatarPath+'/'+req.file.filename;
            }
            user.save();
            return res.redirect('back');
        });
    } catch(err) {
        req.flash('error',err);
        return res.redirect('back');
    }
} else {
    req.flash('error','Unauthorized');
    return res.status(401).send('Unauthorized');
}
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
        req.flash('error','Passwords or account do not match');
        return res.redirect('back');
    }
    
    User.findOne({email:req.body.email}).then(function(user){
        
        if(!user){
                 User.create(req.body).then(function(user){
                    req.flash('success','Account Created Successfully');
                return res.redirect('/users/sign-in');
            });
        }else{
            req.flash('error','Account Already Exists');
            return res.redirect('back');
        }
    }
    );
}

module.exports.createSession= function(req,res) {
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}


    
module.exports.destroySession= function(req,res,next) {
    req.logout(function(err){
        if(err){
            console.log(err);
            return;
        }
        req.flash('success','You have logged out!');
        return res.redirect('/');
    });
}







