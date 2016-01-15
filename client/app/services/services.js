angular.module('boorish.services', [])

// Questions factory handles all requests to add, retrieve, or modify questions in the database

.factory('Questions', function($http, $location) {
  return {
    // add a question from /ask
    addQuestion: function(question, $rootScope) {
      console.log($rootScope.user);

      return $http({
        method: 'POST',
        url: '/api/questions',
        data: question
      });
    },

    getAllQuestions: function() {
      return $http({
        method: 'GET',
        url: '/api/questions/'
      })
      .then(function(res) {
        return res.data.results;
      });
    },

    getQuestion: function(questionId) {
      return $http({
        method: 'GET',
        url: '/api/questions/' + questionId
      })
      .then(function(res) {
        return res.data;
      });

    
    },

    // updates a question. takes in the id of the question and the required modification
    updateQuestion: function(id, mod) {
      return $http({
        method: 'POST',
        url: 'api/questions/' + id,
        data: { mod: mod } // possible mods = 'like' to increase like points, 'good' to mark as good (by teacher), 'answered', 'closed'
      })
    },

    // removes a question. Only available to the user who posted it or a Teacher (isAdmin = true)
    removeQuestion: function(questionID) {
      return $http({
        method: 'DELETE',
        url: 'api/questions/' + questionID
      })
    }
  }
})

// Answers factory handles all requests to add, retrieve, or modify answers in the database

.factory('Answers', function($http) {

  return {
    // get all answers
    getAnswers: function() {
      return $http({
        method: 'GET',
        url: 'api/answers',
      })
      .then(function(res) {
        return res.data;
      })
    },

    // adds an answer to a question. requires the answer object and question ID
    addAnswer: function(answer, questionID) {

      return $http({
        method: 'POST',
        url: 'api/answers',
        data: JSON.stringify({
          text: answer.text,
          id_question: questionID,
          id_user: answer.user
        })
      })
    },

    // updates an answer. requires the answerID and requested modification (mod). mod is a string.
    updateAnswer: function(answerID, mod) {
      return $http({
        method: 'POST',
        url: 'api/answers/' + answerID,
        data: JSON.stringify({
          id_answer: answerID,
          mod: mod // possible mods: 'like' to increase the number of points on a question, 'good' to mark as good
        })
      })
    },

    // removes an answer. requires the id of the answer
    removeAnswer: function(answerID) {
      return $http({
        method: 'DELETE',
        url: 'api/answers/' + answerID
      })
    }

  }
})

// Users factory handles all requests to add and retrieve users in the database

.factory('Users', function($http, $window){

  return {

    allUsers: function(){
      return $http({
        method: 'GET',
        url: '/api/users'
      })
      .then(function(res){
        return res.data;
      });
    },

    // users the userID that is stored in localStorage to obtain the user from the database
    getUserWithId: function() {
      var userID = $window.localStorage.getItem('com.boorish');
      return $http({
        method: 'GET',
        url: '/api/users/' + userID
      }).then(function(res) {
        return res.data.results.id;
      })
    },

    addUser: function(user) {
      return $http({
        method: 'POST',
        url: '/api/users',
        data: JSON.stringify({
          username: user.username,
          password: user.password,
          name: user.name,
          isTeacher: user.isTeacher,
          points: 0,
          email: user.email,
          picture: user.picture
        })
      })
    }

  };
})

// Tags and Course factories just pull Tags and Courses from the database

.factory('Tags', function($http) {
  
  return {

    getTags: function() {
      return $http({
        method: 'GET',
        url: '/api/tags'
      })
      .then(function(res) {
        return res.data;
      });
    }

  };
})

.factory('Courses', function($http) {
  
  return {

    getCourses: function() {
      return $http({
        method: 'GET',
        url: '/api/courses'

      })
      .then(function(res) {
        return res.data.results;
      });
    }
  };
})

.factory('Auth', function ($http, $location, $window, $rootScope) {
  var user = {};

  return {
    
    setUser: function () {
      return $http({
        method: 'GET',
        url: '/auth/google'
      })
      .then(function (res) {
        console.log('res', res);
        console.log('json parsed data', JSON.parse(res.data));
        user.google = res.data.email || res.data.profile.emails[0].value;

        return $http({
          method: 'GET',
          url: '/api/users'
        })
        .then(function(res) {
          var users = res.data.results;
          var isUser = false;
          for (var i = 0; i < users.length; i++) {
            console.log()
            if (users[i].email === user.google) {
              isUser = true;
              $rootScope.user = users[i];
              console.log($rootScope.user);
              continue;
            }
          }
          if (isUser) {
            $location.path('/questions');
          } else {
            $location.path('/auth/google');
          }
        })
      });
  },

  isAuth: function () {
    return !!$rootScope.user;
  },

  signout: function () {
    $rootScope.user = undefined;
    $location.path('/signin');
  }
}

});

// [{
//           id: 1,
//           user: "cpenarrieta",
//           coursename: "math",
//           tagname: "homework",
//           title: "How to make whatsapp type of animation for opening the menu",
//           imgUrl: "http://images.apple.com/pr/bios/images/1501cue_thumb.jpg",
//           createdAt: '04/07/2016',
//           updatedAt: '04/07/2016'
//         },{
//           id: 2,
//           user: "ranjit",
//           coursename: "history",
//           tagname: "quiz",
//           title: "answer number 1, ",
//           imgUrl: "http://images.apple.com/pr/bios/images/cook_thumb.jpg",
//           createdAt: '04/07/2016',
//           updatedAt: '04/07/2016',
//           comments: [{
//             username: "jose",
//             text: "Secondary line text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh."
//           },{
//             username: "mieul",
//             text: "Secondary line text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh."
//           }]
//         },{
//           id: 3,
//           user: "sergio",
//           coursename: "history",
//           tagname: "quiz",
//           title: "answer number 2, ",
//           imgUrl: "http://images.apple.com/pr/bios/images/ahrendts_thumb.jpg",
//           createdAt: '04/07/2016',
//           updatedAt: '04/07/2016',
//           comments: [{
//             username: "cpenarrieta",
//             text: "Secondary line text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh."
//           },{
//             username: "cpenarrieta",
//             text: "Secondary line text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh."
//           }]
//         },{
//           id: 4,
//           user: "juan",
//           coursename: "history",
//           tagname: "quiz",
//           title: "answer number 3, ",
//           imgUrl: "http://images.apple.com/pr/bios/images/federighi_thumb20120727.jpg",
//           createdAt: '04/07/2016',
//           updatedAt: '04/07/2016',
//           comments: [{
//             username: "cpenarrieta",
//             text: "Secondary line text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh."
//           },{
//             username: "pedro",
//             text: "Secondary line text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh."
//           }]
//         },{
//           id: 5,
//           user: "pedro",
//           coursename: "history",
//           tagname: "quiz",
//           title: "answer number 4, ",
//           imgUrl: "http://images.apple.com/pr/bios/images/ive_thumb20110204.jpg",
//           createdAt: '04/07/2016',
//           updatedAt: '04/07/2016',
//           comments: [{
//             username: "ranjit",
//             text: "Secondary line text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh."
//           },{
//             username: "sergio",
//             text: "Secondary line text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh."
//           }]
//         }];

//         [{
//           id: 1,
//           user: "cpenarrieta",
//           coursename: "math",
//           tagname: "homework",
//           title: "How to make whatsapp type of animation for opening the menu from toolbar(actionbar)",
//           imgUrl: "http://images.apple.com/pr/bios/images/1501cue_thumb.jpg",
//           createdAt: '04/07/2016',
//           updatedAt: '04/07/2016'
//         },{
//           id: 2,
//           user: "ranjit",
//           coursename: "history",
//           tagname: "quiz",
//           title: "question title 2",
//           imgUrl: "http://images.apple.com/pr/bios/images/cook_thumb.jpg",
//           createdAt: '04/07/2016',
//           updatedAt: '04/07/2016'
//         },{
//           id: 3,
//           user: "ranjit",
//           coursename: "history",
//           tagname: "quiz",
//           title: "question title 2",
//           imgUrl: "http://images.apple.com/pr/bios/images/cook_thumb.jpg",
//           createdAt: '04/07/2016',
//           updatedAt: '04/07/2016'
//         },{
//           id: 4,
//           user: "ranjit",
//           coursename: "history",
//           tagname: "quiz",
//           title: "question title 2",
//           imgUrl: "http://images.apple.com/pr/bios/images/cook_thumb.jpg",
//           createdAt: '04/07/2016',
//           updatedAt: '04/07/2016'
//         },{
//           id: 5,
//           user: "ranjit",
//           coursename: "history",
//           tagname: "quiz",
//           title: "question title 2",
//           imgUrl: "http://images.apple.com/pr/bios/images/cook_thumb.jpg",
//           createdAt: '04/07/2016',
//           updatedAt: '04/07/2016'
//         }];