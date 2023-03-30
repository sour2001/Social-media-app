const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
//use crypto to generate random password
const crypto=require('crypto');
const User=require('../models/user');
const env=require('./environment');
//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID:env.outlook_clientID,
    clientSecret:env.outlook_clientSecret,
    callbackURL:env.outlook_callbackURL
    
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



    

