const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const port = env.port || 8000;

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const path = require('path');

const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);



chatServer.listen(5000);
// middleware for sass
if(env.name=='development'){
app.use(sassMiddleware({
  src:path.join(__dirname,env.asset_path,'scss'),
  dest:path.join(__dirname,env.asset_path,'css'),
  debug: true, 
  outputStyle: 'extended',
  prefix: '/css'
}));
}

const urlencodedParser = express.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(cookieParser());
app.use(express.static(env.asset_path));

// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// use express router
// shifted down to use passport after session cookie
// app.use('/',require('./routes/index'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');
console.log(env.name);

app.use(session({
  name: 'codeial',
  // TODO change the secret before deployment in production mode
  secret: env.session_cookie_key,
  saveUninitialized: false,
  resave: false,
  cookie:{
      maxAge:(1000*60*100)
  },

  store: new MongoStore(
    {
      mongoUrl: 'mongodb://localhost/codeial_development',
      autoRemove: 'disabled'
    },
    function (err) {
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

app.use('/', require('./routes/index'));
app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
