angular.module('fitApp.controllers').
controller('UserController', ['$scope','$location','userService','$http','$window',function($scope,$location,userService,$http, $window) {
    console.log($window.sessionStorage);
    $scope.user = {};
    $scope.loading = false;
    $scope.submitted = false;
    $scope.errors = [];
    $scope.success = false;
    $scope.register = function() {
        $scope.error = false;
        $scope.success = false;
        if (!$scope.register_form.$valid) {
            $scope.submitted = true;
        } else {
            $scope.submitted = false;
            // $scope.success = false;
            $scope.error = false;
            $scope.loading = true;
            userService.post($scope.user).then(function(data) {
                $scope.success = data.success;
                // redirect to my profile
                $location.path('/myprofile');
            }, function(err) {
                $scope.error = err.data.error;
                $scope.errors = err.data.errors;
            });
        }
    };
    $scope.login = function() {
        $scope.error = false;
        $scope.success = false;
        if (!$scope.login_form.$valid) {
            $scope.submitted = true;
        } else {
            $scope.submitted = false;
            // $scope.success = false;
            $scope.error = false;
            $scope.loading = true;
            userService.postAuth($scope.user).
            then(function(data) {
                $location.path('/myprofile');
            },function(err) {
                // there was an error authentifying the user
                $scope.error = true;
                $scope.errors = [err.data.error.message];
            });
        }
    };
    $scope.clear = function() {
        $scope.error = false;
        $scope.success = false;
        $scope.submitted = false;
        $scope.register_form.$setPristine();
    };
  }]);
