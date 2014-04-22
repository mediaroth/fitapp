var fitApp = angular.module('fitApp', ['ngRoute']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'views/start.html',
        controller: 'homeController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]).
  controller('homeController', function($scope) {

  }).
  controller('mainController', function($scope, $http, Exercise) {
    // object to hold all the data for the new exercise form
    $scope.exerciseData = {};

    // loading variable to show the spinning loading icon
    $scope.loading = true;

    // get all the exercises first and bind it to the $scope.exercises object
    // use the function we created in our service
    // GET ALL exerciseS ====================================================
    Exercise.get()
      .success(function(data) {
        $scope.exercises = data;
        $scope.loading = false;
      });

    // function to handle submitting the form
    // SAVE A exercise ======================================================
    $scope.submitExercise = function() {
      $scope.loading = true;

      // save the exercise. pass in exercise data from the form
      // use the function we created in our service
      Exercise.save($scope.exerciseData)
        .success(function(data) {

          // if successful, we'll need to refresh the exercise list
          Exercise.get()
            .success(function(getData) {
              $scope.exercises = getData;
              $scope.loading = false;
            });

        })
        .error(function(data) {
          console.log(data);
        });
    };

    // function to handle deleting a exercise
    // DELETE A exercise ====================================================
    $scope.deleteExercise = function(id) {
      $scope.loading = true;

      // use the function we created in our service
      Exercise.destroy(id)
        .success(function(data) {

          // if successful, we'll need to refresh the exercise list
          Exercise.get()
            .success(function(getData) {
              $scope.exercises = getData;
              $scope.loading = false;
            });

        });
    };;
}).
factory('Exercise', function($http) {

    return {
      // get all the exercises
      get : function() {
        return $http.get('/api/exercises');
      },

      // save a exercise (pass in exercise data)
      save : function(exerciseData) {
        return $http({
          method: 'POST',
          url: '/api/exercises',
          headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
          data: $.param(exerciseData)
        });
      },

      // destroy a exercise
      destroy : function(id) {
        return $http.delete('/api/exercises/' + id);
      }
    }
});