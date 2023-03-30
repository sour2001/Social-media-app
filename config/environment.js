const development = {
    name: 'development',
    asset_path: './assets',    
    session_cookie_key:'blahsomething',
    db: 'new_codeial_development',
    smtp: {
        service:'outlook',
    host:'smtp.outlook.com',
    port:587,
    secure:false,
    auth:{
        user:'saurabhdahiya2@outlook.com',
        pass:'Dahiya@1234'
    }
    },
    outlook_clientID:"402790903644-1lo069rv3jln7v3a5im190jslkk8v8f7.apps.googleusercontent.com",
    outlook_clientSecret:"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",
    outlook_callbackURL:"http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial',
};

const production = {
    name: 'production',
 
};

module.exports = development;