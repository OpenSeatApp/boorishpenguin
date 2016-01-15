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
passport.use(new GoogleStrategy({
  clientID: apikeys.googleOauth.clientID,
  clientSecret: apikeys.googleOauth.clientSecret,
   callbackURL: "http://127.0.0.1:8001/auth/google/callback"
},
  function(accessToken, refreshToken, profile, done) {
    var queryObject = {};
    queryObject.username = profile.emails[0].value;
    queryObject.name_last = profile.name.familyName;
    queryObject.name_first = profile.name.givenName;
    queryObject.name = queryObject.name_first + " " + queryObject.name_last;
    queryObject.email = profile.emails[0].value;
    queryObject.username = queryObject.email;
    queryObject.picture = profile.photos ? profile.photos[0].value : "";

    User.findOrCreate({where: queryObject}).spread(function(user, created) {
      return done(null, user);
    });
  }));

