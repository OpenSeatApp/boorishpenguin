angular.module('Main', ['ui.router', 'ngMaterial', 'main.controller', 'boorish.questions' ,'boorish.services', 'boorish.ask', 'boorish.answers', 'boorish.login','boorish.user'])
  .config(function ($stateProvider, $mdThemingProvider, $urlRouterProvider) {

    var checkLoggedin = function($q, $http, $location, $rootScope) {
     var deferred = $q.defer();

     $http.get('/api/loggedin').success(function(user) {
       if (user !== '0') {
         $rootScope.user = user;
         deferred.resolve();
       } else {
         deferred.reject();
         $location.url('/');
       }
     });

       return deferred.promise;
     };

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl : 'app/login/index.html',
        controller: 'loginController'
      })
      .state('questions', {
        url: '/questions',
        templateUrl : 'app/questions/index.html',
        controller: 'questionsController',
        resolve: { loggedin: checkLoggedin }
      })
      .state('answers', {
        url: '/questions/:id',
        templateUrl : 'app/answers/index.html',
        controller: 'answersController',
        resolve: { loggedin: checkLoggedin }
      })
      .state('user', {
        url: '/user/:id',
        templateUrl : 'app/user/index.html',
        controller: 'userController',
        resolve: { loggedin: checkLoggedin }
      })
      .state('ask', {
        url: '/ask',
        templateUrl : 'app/ask/index.html',
        controller: 'askController',
        resolve: { loggedin: checkLoggedin }
      });

      $urlRouterProvider
        .otherwise('/login');

      $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('blue-grey');

  })


  .run(function () {
    console.log('running');
  });
 

 /*
Possible Angular Material Themes to explore:
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
