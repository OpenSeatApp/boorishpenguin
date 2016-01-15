angular.module('Main', ['ui.router', 'ngMaterial', 'main.controller', 'boorish.questions' ,'boorish.services', 'boorish.ask', 'boorish.answers', 'boorish.login'])
  .config(function ($stateProvider, $mdThemingProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl : 'app/login/index.html',
        controller: 'loginController'
      })
      .state('questions', {
        url: '/questions',
        templateUrl : 'app/questions/index.html',
        controller: 'questionsController'
      })
      .state('answers', {
        url: '/questions/:id',
        templateUrl : 'app/answers/index.html',
        controller: 'answersController'
      })
      .state('ask', {
        url: '/ask',
        templateUrl : 'app/ask/index.html',
        controller: 'askController'
      });

      $urlRouterProvider
        .otherwise('/login');

      $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('blue-grey');

  })

  .factory('AttachTokens', function () {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      object.headers['Allow-Control-Allow-Headers'] = 'Content-Type';
      object.headers['Allow-Control-Allow-Origin'] = '*';
      object.headers['Allow-Control-Allow-Methods'] = '*';
      return object;
    }
  };
  return attach;
})

  .run(function () {
    console.log('running');
  });
 

 /*
Possible Angular Material Themes:
red
pink
purple
deep-purple
indigo
blue
light-blue
cyan
teal
green
light-green
lime
yellow
amber
orange
deep-orange
brown
grey
blue-grey
 */




// angular.module('boorishpenguin', [
//   'boorish.services',
//   'boorish.users',
//   'boorish.ask',
//   'boorish.questions',
//   'boorish.answers',
//   'boorish.auth',
//   'ngRoute'
//   ])

// .config(function ($routeProvider, $sceProvider) {
//   $routeProvider
//     .when('/', {
//       templateUrl: 'app/questions/questions.html',
//       controller: 'questionsController'
//     })
//     .when('/ask', {
//       templateUrl: 'app/ask/ask.html',
//       controller: 'askController'
//     })
//     .when('/questions', {
//       templateUrl: 'app/questions/questions.html',
//       controller: 'questionsController'
//     })
//     .when('/questions/:id', {
//       templateUrl: 'app/answers/answers.html',
//       controller: 'answersController'
//     })
//     .when('/users', {
//       templateUrl: 'app/users/users.html',
//       controller: 'UsersController'
//     })
//     .when('/signin', {
//       templateUrl: 'app/auth/signin.html',
//       controller: 'AuthController'
//     })
//     .otherwise({
//       routeTo: '/signin'
//     })

//   $sceProvider.enabled(false);
// });
