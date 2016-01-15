var questionControllers = require ('../controllers/questionController.js');
var commentControllers = require ('../controllers/commentController.js');
var answerControllers = require ('../controllers/answerController.js');
var userControllers = require ('../controllers/userControllers.js');
var courseControllers = require ('../controllers/courseControllers.js');
var tagControllers = require ('../controllers/tagControllers.js');
var voteController = require ('../controllers/voteController.js');
var adminControllers = require ('../controllers/adminControllers.js');
var passport = require('passport');


<<<<<<< HEAD
module.exports = function(app, express) {
  app.get('/api/admin', adminControllers.getStaff);
  app.put('/api/admin/:id', adminControllers.toggleTeacherAccess);
  app.get('/api/questions', questionControllers.allQuestions);
  app.post('/api/questions', questionControllers.newQuestion);
  app.delete('/api/questions/:id', questionControllers.deleteQuestion);

  app.get('/api/questions/:id', questionControllers.renderQuestion);
  app.put('/api/questions/changeStatus/:id', questionControllers.toggleCloseQuestion);
  app.put('/api/questions/markAsGood/:id' , questionControllers.markAsGoodQuestion);
  app.put('/api/questions/vote/:id' , voteController.votePost);


  app.post('/api/answers', answerControllers.newAnswer);
  app.put('/api/answers/markAsCorrect/:id', answerControllers.markAsCorrectAnswer);
  app.put('/api/answers/vote/:id' , voteController.votePost);
  app.delete('/api/answers/:id', answerControllers.deleteAnswer);

  app.get('/api/comments/:id', commentControllers.allComments);
  app.post('/api/comments', commentControllers.newComment);
  app.delete('/api/comments/:id', commentControllers.deleteComment);

  app.get('/api/users', userControllers.allUsers);
  app.get('/api/users/:id', userControllers.oneUser);
  app.get('/api/users/getFullProfile/:id', userControllers.getFullProfile);

  app.post('/api/signup', userControllers.newUser);

  app.get('/api/courses', ensureAuth, courseControllers.allCourses);

  app.get('/api/tags', ensureAuth, tagControllers.allTags);

  app.get('/api/loggedin', function(req, res) {
   res.send(req.isAuthenticated() ? req.user : '0');
 });

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
