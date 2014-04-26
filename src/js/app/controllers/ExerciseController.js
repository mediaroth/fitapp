
angular.module('fitApp.controllers').
controller('ExerciseController', ['$scope','exerciseService',function($scope,exerciseService) {
    $scope.exerciseData = {};
    $scope.exercises = [];
    $scope.loading = false;
    $scope.submitted = false;
    $scope.errors = [];
    $scope.success = false;

    $scope.exercises = exerciseService.getAll().$object;

    $scope.submit = function() {
        $scope.error = false;
        $scope.success = false;
        if (!$scope.exercise_form.$valid) {
            $scope.submitted = true;
        } else {
            $scope.submitted = false;
            // $scope.success = false;
            $scope.error = false;
            $scope.loading = true;
            //PUT
            if ($scope.exerciseData.id) {
                exerciseService.put($scope.exerciseData).then(function(data) {
                    $scope.success = data.success;
                    return exerciseService.getAll();
               }).then(function(data) {
                    $scope.exercises = data;
                    $scope.loading = false;
                }, function(err) {
                    console.log(err);
                });
            } else { // CREATE
                exerciseService.post($scope.exerciseData).then(function(data) {
                    console.log(data);
                    $scope.success = data.success;
                    return exerciseService.getAll();
                }, function(err) {
                    $scope.error = err.data.error;
                    $scope.errors = err.data.errors;
                    return exerciseService.getAll();
                }).finally(function() {
                    // how to implement ?
                }).then(function(data) {
                    $scope.exercises = data;
                    $scope.loading = false;
                }, function(err) {
                    console.log(err);
                });
            }
        }

    };
    $scope.destroy = function(id) {
        $scope.loading = true;
        exerciseService.destroy(id).then(function() {
            console.log('deleted ' + id);
            return exerciseService.getAll();
        },function(err) {
            console.log(err);
        }).then(function(data) {
            console.log('updated list');
            $scope.exercises = data;
            $scope.loading = false;
        });
    };
    $scope.edit = function(id) {
        $scope.error = false;
        $scope.success = false;
        exerciseService.get(id).then(function(data) {
            $scope.exerciseData = data;
        });
        // var obj1 = _.find($scope.exercises, function(obj) {
        //     return obj.id === id;
        // });
        // console.log(obj1);
        // $scope.exerciseData = angular.copy(obj1);
        // console.log($scope.exerciseData);
        // console.log($scope.exerciseData === obj1);
    };
    $scope.clear = function() {
        $scope.exerciseData = {};
        $scope.error = false;
        $scope.success = false;
        $scope.submitted = false;
        $scope.exercise_form.$setPristine();
        // $scope.exercise_form.description.$setPristine();
    };
  }]);
