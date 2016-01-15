angular.module('boorish.login', [])
.controller('loginController', function($scope, $state, $location, Auth) {

  $scope.signin = function () {

    Auth.setUser().then(function() {
      $location.path('/questions');
    })
      .catch(function (error) {
        console.error(error);
      });
  };
});