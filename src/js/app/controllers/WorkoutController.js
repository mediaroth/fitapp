
angular.module('fitApp.controllers').
controller('WorkoutController', ['$scope','$http','workoutService',function($scope,$http,workoutService) {
    $scope.workoutData = {};
    $scope.workouts = [];
    $scope.loading = false;
    $scope.submitted = false;
    $scope.errors = [];
    $scope.success = false;
    $scope.workouts = workoutService.getAll().$object;
    $scope.submit = function() {
        $scope.error = false;
        $scope.success = false;
        if (!$scope.workout_form.$valid) {
            $scope.submitted = true;
        } else {
            $scope.submitted = false;
            // $scope.success = false;
            $scope.error = false;
            $scope.loading = true;
            //PUT
            if ($scope.workoutData.id) {
                workoutService.put($scope.workoutData).then(function(data) {
                    $scope.success = data.success;
                    return workoutService.getAll();
               }).then(function(data) {
                    $scope.workouts = data;
                    $scope.loading = false;
                }, function(err) {
                    console.log(err);
                });
            } else { // CREATE
                workoutService.post($scope.workoutData).then(function(data) {
                    console.log(data);
                    $scope.success = data.success;
                    return workoutService.getAll();
                }, function(err) {
                    $scope.error = err.data.error;
                    $scope.errors = err.data.errors;
                    return workoutService.getAll();
                }).finally(function() {
                    // how to implement ?
                }).then(function(data) {
                    $scope.workouts = data;
                    $scope.loading = false;
                }, function(err) {
                    console.log(err);
                });
            }
        }
    };
    $scope.destroy = function(id) {
        $scope.loading = true;
        workoutService.destroy(id).then(function() {
            console.log('deleted ' + id);
            return workoutService.getAll();
        },function(err) {
            console.log(err);
        }).then(function(data) {
            console.log('updated list');
            $scope.workouts = data;
            $scope.loading = false;
        });
    };
    $scope.edit = function(id) {
        $scope.error = false;
        $scope.success = false;
        workoutService.get(id).then(function(data) {
            $scope.workoutData = data;
        });
        // var obj1 = _.find($scope.workouts, function(obj) {
        //     return obj.id === id;
        // });
        // console.log(obj1);
        // $scope.workoutData = angular.copy(obj1);
        // console.log($scope.workoutData);
        // console.log($scope.workoutData === obj1);
    };
    $scope.clear = function() {
        $scope.workoutData = {};
        $scope.error = false;
        $scope.success = false;
        $scope.submitted = false;
        $scope.workout_form.$setPristine();
        // $scope.workout_form.description.$setPristine();
    };
  }]);
