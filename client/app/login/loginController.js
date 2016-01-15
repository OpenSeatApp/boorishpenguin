angular.module('boorish.login', [])
.controller('loginController', function($scope, $state, $location, Auth) {

  $scope.signin = function () {
    // $http({
    //   method: 'GET',
    //   url: '/api/users'
    // }).then(function(res) {
    //   var users = res.results;
    //   $window.localStorage.setItem('com.boorish', users);
    // })
    console.log('signin is firing');
    Auth.setUser().then(function() {
      $location.path('/questions');
    })
      .catch(function (error) {
        console.error(error);
      });
  };
});