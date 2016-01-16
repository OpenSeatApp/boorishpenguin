angular.module('boorish.auth', [])

.controller('AuthController', function ($scope, $location, Auth, $window) {
  $scope.user = {};

  $scope.signin = function () {

    Auth.setUser().then(function() {
      $location.path('/questions');
    })
      .catch(function (error) {
        console.error(error);
      });
  };
});