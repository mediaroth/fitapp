angular.module('fitApp.controllers').
controller('HomeController', function($scope,Auth) {
  $scope.user = Auth.getUser();
  $scope.test = 'Hello World, I\'m so cool ! Maybe even more so !! Oh Yeaahhhh, so jelly right now'
});
