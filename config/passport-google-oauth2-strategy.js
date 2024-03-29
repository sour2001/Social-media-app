const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
//use crypto to generate random password
const crypto=require('crypto');
const User=require('../models/user');
const env=require('./environment');
//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: env.outlook_clientID,
    clientSecret: env.outlook_clientSecret,
    callbackURL: env.outlook_callbackURL
}, function(accessToken, refreshToken, profile, done) {
    // Find or create the user
    User.findOne({email: profile.emails[0].value}).exec()
        .then(function(user) {
            if (user) {
                // User found, return it
                return done(null, user);
            } else {
                // User not found, create it
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                })
                    .then(function(user) {
                        return done(null, user);
                    })
                    .catch(function(err) {
                        console.log('Error in creating user');
                        return done(err);
                    });
            }
        })
        .catch(function(err) {
            console.log('Error in finding user');
            return done(err);
        });
}));







module.exports=passport;



    

