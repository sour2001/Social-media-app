const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
//use crypto to generate random password
const crypto=require('crypto');
const User=require('../models/user');
//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID:"402790903644-1lo069rv3jln7v3a5im190jslkk8v8f7.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:8000/users/auth/google/callback"
},
function(accessToken,refreshToken,profile,done){
    User.findOne({email:profile.emails[0].value}).exec()
    .then(function(user){
        if(user){
            //if found, set this user as req.user
            return done(null,user);
        }
        else{
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err){
                    console.log('error in creating user');
                    return;
                }
                return done(null,user);
            });
        }
    })
    .catch(function(err){
        console.log('error',err);
        return;
    });
}
));

module.exports=passport;



    

