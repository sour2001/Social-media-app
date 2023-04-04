const fs=require('fs');
const path=require('path');
const rfs=require('rotating-file-stream');
const logDirectory=path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream=rfs.createStream('access.log',{
    interval:'1d',
    path:logDirectory
});




const development = {
    name: 'development',
    asset_path: './assets',    
    session_cookie_key:process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
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
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}
    }

};

const production = {

    name: 'production',
    asset_path: process.env.ASSET_PATH,    
    session_cookie_key:process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service:'outlook',
    host:'smtp.outlook.com',
    port:587,
    secure:false,
    auth:{
        user:process.env.GMAIL_USERNAME,
        pass:process.env.GMAIL_PASSWORD
    }
    },
    outlook_clientID:process.env.GOOGLE_CLIENT_ID,
    outlook_clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    outlook_callbackURL:process.env.GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}
    }
};


module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT );
