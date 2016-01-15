var questionControllers = require ('../controllers/questionController.js');
var answerControllers = require ('../controllers/answerController.js');
var userControllers = require ('../controllers/userControllers.js');
var courseControllers = require ('../controllers/courseControllers.js');
var tagControllers = require ('../controllers/tagControllers.js');
var voteController = require ('../controllers/voteController.js');
var passport = require('passport');


module.exports = function(app, express, ensureAuth) {
  app.get('/api/questions', ensureAuth, questionControllers.allQuestions);
  app.post('/api/questions', ensureAuth, questionControllers.newQuestion);
  app.delete('/api/questions/:id', ensureAuth, questionControllers.deleteQuestion);

  app.get('/api/questions/:id', ensureAuth, questionControllers.renderQuestion);
  app.put('/api/questions/changeStatus/:id', ensureAuth, questionControllers.toggleCloseQuestion);
  app.put('/api/questions/markAsGood/:id' , ensureAuth, questionControllers.markAsGoodQuestion);
  app.put('/api/questions/vote/:id' , ensureAuth, voteController.votePost);

  app.post('/api/answers', ensureAuth, answerControllers.newAnswer);
  app.put('/api/answers/markAsCorrect/:id', ensureAuth, answerControllers.markAsCorrectAnswer);
  app.put('/api/answers/vote/:id' , ensureAuth, voteController.votePost);
  app.delete('/api/answers/:id', ensureAuth, answerControllers.deleteAnswer);

  app.get('/api/users', ensureAuth, userControllers.allUsers);
  app.get('/api/users/:id', ensureAuth, userControllers.oneUser);
  app.post('/api/signup', userControllers.newUser);

  app.get('/api/courses', ensureAuth, courseControllers.allCourses);

  app.get('/api/tags', ensureAuth, tagControllers.allTags);

  // Client does get request to /auth/google on signin
  app.get('/auth/google',
    passport.authenticate('google', { scope:  ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.me', "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"] }));

  // Server.js:38 sends get req to /auth/google/callback after user has successfully logged into google
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
      function(req, res) {
    // sends user to questions page after they successfully login
    res.redirect('/#/questions');
  });

  app.get('/user', function (req, res){
    // sends google user data to client so they can know whose currenty logged in
    res.json(req.user);
  });

};
