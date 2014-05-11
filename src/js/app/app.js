angular.module('fitApp.directives', []);
angular.module('fitApp.services', []);
angular.module('fitApp.filters', []);
// // Often time we'll want to use our services
// // inside of our controllers, so we'll inject
// // those into our 'myApp.controllers' module
angular.module('fitApp.controllers', ['fitApp.services']);
var fitApp = angular.module('fitApp', ['ngRoute','ngAnimate','ngCookies','ui.bootstrap','restangular','fitApp.services','fitApp.controllers','fitApp.filters','fitApp.directives']).
  constant('ACCESS_LEVELS', {
    pub : 0,
    user : 1
  }).
  // config(function($timeout) {
  //   $timeout(function() { return 'text'}, 5000);
  // }).
  config(['$routeProvider','$locationProvider','ACCESS_LEVELS', function($routeProvider, $locationProvider, ACCESS_LEVELS) {
    $locationProvider.html5Mode(true);
    $routeProvider.
      when('/', {
        templateUrl: '/templates/home.html',
        controller: 'HomeController',
        resolve: {
          redirectTo : function($q, $location,userService,$timeout) {
            var deferred = $q.defer();
            userService.checkUser(ACCESS_LEVELS.user).then(function(authorized) {
              if (authorized.data.error) {
                console.log('in app - not authorized');
                $location.path('/login');
                deferred.resolve('yo');
              } else {
                console.log('in app - authorized');
                deferred.resolve('yo');
              }
            }, function(err) {
              console.log('in app - route /resolve - error');
              // $location.path('/login');
              deferred.reject('/login');
            });
            return deferred.promise;
          }
          // },
          // delay: function($q, $defer) {
          //   var delay = $q.defer();
          //   $defer(delay.resolve, 1000);
          //   return delay.promise;
          // }
        },
      }).
      when('/table', {
        templateUrl: '/templates/table.html'
      }).
      when('/workout/option1', {
        templateUrl: '/templates/table.html'
      }).
      when('/workout/option2', {
        templateUrl: '/templates/table.html'
      }).
      when('/exercise', {
        templateUrl: '/templates/exercise.html',
        controller: 'ExerciseController',
        resolve: {
          user : function($q, $location,userService) {
            var deferred = $q.defer();
            userService.checkUser(ACCESS_LEVELS.user).then(function(authorized) {
              console.log(authorized);
              if (!authorized) {
                console.log('in app - not authorized');
                $location.path('/login');
                deferred.reject();
              } else {
                console.log('in app - authorized');
                deferred.resolve();
              }
            }, function(err) {
              $location.path('/login');
              deferred.reject();
            });
            return deferred.promise;
          }
        },
        access_level: ACCESS_LEVELS.user
      }).
      when('/workout', {
        templateUrl: '/templates/workout.html',
        controller: 'WorkoutController',
        resolve: {
          user : function($q, $location,userService) {
            var deferred = $q.defer();
            userService.checkUser(ACCESS_LEVELS.user).then(function(authorized) {
              console.log(authorized);
              if (!authorized) {
                console.log('in app - not authorized');
                $location.path('/login');
                deferred.reject();
              } else {
                console.log('in app - authorized');
                deferred.resolve();
              }
            }, function(err) {
              $location.path('/login');
              deferred.reject();
            });
            return deferred.promise;
          }
        },
        access_level: ACCESS_LEVELS.user
      }).
      when('/register', {
        templateUrl: '/templates/register.html',
        controller: 'UserController',
        access_level: ACCESS_LEVELS.pub
      }).
      when('/logout', {
        resolve: {
          user : function($q,$location,userService) {
            var deferred = $q.defer();
            userService.logout().
            then(function() {
              $location.path('/login');
              deferred.resolve();
            }, function(err) {
              console.log('could not logout user !');
              deferred.reject();
            });
            return deferred.promise;
          }
        }
      }).
      when('/myprofile', {
        templateUrl: '/templates/myprofile.html',
        controller: 'UserController',
        access_level: ACCESS_LEVELS.user
      }).
      when('/login', {
        templateUrl: '/templates/login.html',
        controller: 'UserController',
        access_level: ACCESS_LEVELS.pub
      }).
      otherwise({
        redirectTo: '/',
        templateUrl: '/templates/home.html',
        resolve: {
          user : function($q, $location,userService,$timeout) {
            var deferred = $q.defer();
            userService.checkUser(ACCESS_LEVELS.user).then(function(authorized) {
              console.log(authorized);
              if (!authorized) {
                console.log('in app - not authorized');
                $location.path('/login');
                deferred.reject();
              } else {
                console.log('in app - authorized');
                deferred.resolve();
              }
              return deferred.promise;
            }, function(err) {
              console.log('in app - route resolve - error');
              $location.path('/login');
              deferred.reject();
              return deferred.promise;
            });
          }
        }
      });
  }]).
  factory('authInterceptor', function ($rootScope, $q, $window,$location) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers['X-AUTH-TOKEN'] = $window.sessionStorage.token;
        }
        return config;
      },
      response: function (response) {
        return response || $q.when(response);
      }
    };
}).config(['$httpProvider',function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
}]).run(function($rootScope,$location,userService) {
  $rootScope.$on('$routeChangeStart', function(e, curr, prev) {
    if (curr.$$route && curr.$$route.resolve) {
      // Show a loading message until promises are not resolved
      $rootScope.loadingView = true;
    }
  });
  $rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
    // Hide loading message
    $rootScope.loadingView = false;
  });
  $rootScope.isSpecificPage = function() {
    var path;
    path = $location.path();
    return _.contains(['/404', '/500', '/login', '/register'], path);
  };

});
