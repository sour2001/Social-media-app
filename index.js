const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();
const port=8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const MongoStore=require('connect-mongo');
const sassMiddleware=require('node-sass-middleware');
const flash=require('connect-flash');
const customMware=require('./config/middleware');
const noty=require('noty');





//middleware for sass
app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle:'extended', 
    prefix:'/css'
}));



const urlencodedParser=express.urlencoded({extended:false});
app.use(urlencodedParser);
app.use(cookieParser());
app.use(express.static('./assets'));
// make the uploads path available to the browser
app.use('/uploads',express.static(__dirname+'/uploads'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


// use express router
//shifted down to use passport after session cookie
// app.use('/',require('./routes/index'));

// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

app.use(session({
    name:'codeial',
    // TODO change the secret before deployment in production mode
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    //removed after adding mongo store becaue mongo-store store the session cookie in db and no need to sign in again when server restarts
     // cookie:{
    //     maxAge:(1000*60*100)
    // }
    
    store:MongoStore.create(
        {
            mongoUrl:'mongodb://localhost/codeial_development',
            autoRemove:'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());


//check if session cookie is present
app.use(passport.setAuthenticatedUser);
//use flash
app.use(flash());
app.use(customMware.setFlash);

app.use('/',require('./routes/index'));
app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});
