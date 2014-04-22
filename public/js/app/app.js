angular.module('fitApp.directives', []);
angular.module('fitApp.services', []);
angular.module('fitApp.filters', []);
// // Often time we'll want to use our services
// // inside of our controllers, so we'll inject
// // those into our 'myApp.controllers' module
angular.module('fitApp.controllers', ['fitApp.services']);
var fitApp = angular.module('fitApp', ['ngRoute','restangular','fitApp.services','fitApp.controllers','fitApp.filters','fitApp.directives']).
  config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
      when('/', {
        templateUrl: '/js/app/partials/home.html',
        controller: 'HomeController'
      }).
      when('/exercise', {
        templateUrl: '/js/app/partials/exercise.html',
        controller: 'ExerciseController'
      }).
      when('/workout', {
        templateUrl: '/js/app/partials/workout.html',
        controller: 'WorkoutController'
      }).
      otherwise({
        redirectTo: '/',
        templateUrl: '/js/app/partials/home.html',
      });
  }]);

