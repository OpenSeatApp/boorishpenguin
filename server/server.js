var express = require('express');
var bodyParser = require('body-parser');
var googleAuth = require('./auth/googleAuth.js');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var session = require('express-session');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var apikeys = require('./config/apikeys.js');
var controllers = require('./controllers/userControllers.js');
var sequelize = require('sequelize');
var db = require('./db/index.js');
var User = db.User;
var app = express();
var port = process.env.PORT || 8001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/../client'));
app.use(cookieParser());
app.use(cors());
app.use(session({ secret: 'hi' , resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/routes.js')(app, express, googleAuth.ensureAuth);

app.listen(port);
module.exports = app;

/* If you decide to move passport functionality to another file make sure you use the same instance of passport
rather than requiring passport in multiple files */
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// When user logged in does a get req to auth/google/callback
var extend = function(obj1, obj2) {
  for (var key in obj2) {
    obj1[key] = obj2[key];
  }
}

passport.use(new GoogleStrategy({
  clientID: apikeys.googleOauth.clientID,
  clientSecret: apikeys.googleOauth.clientSecret,
  //callbackURL: "https://fathomless-sands-7752.herokuapp.com/auth/google/callback"
   callbackURL: "http://127.0.0.1:8001/auth/google/callback"
},
  function(accessToken, refreshToken, profile, done) {
  	console.log('profile', profile); 
  	var queryObject = {};
    queryObject.google_id = profile.id; 
  	queryObject.username = profile.emails[0].value;
  	queryObject.name_last = profile.name.familyName;
  	queryObject.name_first = profile.name.givenName;
  	queryObject.name = queryObject.name_first + " " + queryObject.name_last;
  	queryObject.email = profile.emails[0].value;
  	queryObject.username = queryObject.email;
  	//TODO: not have username === email
  	User.findOrCreate({where: {google_id: profile.id}}).spread(function(user, created) {
      // console.log('user', user);
      // user.updateAttributes(queryObject).success(function() {
        User.update(queryObject, { where: {google_id: profile.id} });
    		return done(null, user); 
      // })
  	})
  }));
    // controllers.isUserInDb(profile.emails[0].value, function (inDb){
    //   // if the username/email is in the database run login
    //   if(inDb){
    //     googleAuth.login({profile: profile}, function (err, profile){
    //       return done(err, profile);
    //     });
    //   } else {
    //     googleAuth.signup({profile: profile}, function (err, profile){
    //       return done(err, profile);
    //     })
    //   }
    //   })
// }));
