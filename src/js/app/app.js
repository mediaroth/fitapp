angular.module('fitApp.directives', []);
angular.module('fitApp.services', []);
angular.module('fitApp.filters', []);
// // Often time we'll want to use our services
// // inside of our controllers, so we'll inject
// // those into our 'myApp.controllers' module
angular.module('fitApp.controllers', ['fitApp.services']);
var fitApp = angular.module('fitApp', ['ngRoute','ngCookies','restangular','fitApp.services','fitApp.controllers','fitApp.filters','fitApp.directives']).
  constant('ACCESS_LEVELS', {
    pub : 1,
    user : 2
  }).
  run(['$rootScope','$location','Auth',function($rootScope,$location,Auth) {
    $rootScope.test = 'Hello from root';
    $rootScope.$on('$routeChangeStart',
      function(evt, next, curr) {
        if(!Auth.isAuthorized(next.access_level)) {
          if(Auth.isLoggedIn()) {
            console.log('no permissions',next.access_level,Auth.isLoggedIn());
            $location.path('/');
          } else {
            console.log('not authorized');
            $location.path('/login');
          }
        }
      }
    );
  }]).
  config(['$routeProvider','$locationProvider','ACCESS_LEVELS', function($routeProvider, $locationProvider, ACCESS_LEVELS) {
    $locationProvider.html5Mode(true);
    $routeProvider.
      when('/', {
        templateUrl: '/templates/home.html',
        controller: 'HomeController',
        access_level: ACCESS_LEVELS.pub
      }).
      when('/exercise', {
        templateUrl: '/templates/exercise.html',
        controller: 'ExerciseController',
        access_level: ACCESS_LEVELS.pub
      }).
      when('/workout', {
        templateUrl: '/templates/workout.html',
        controller: 'WorkoutController',
        access_level: ACCESS_LEVELS.user
      }).
      when('/register', {
        templateUrl: '/templates/register.html',
        controller: 'UserController',
        access_level: ACCESS_LEVELS.pub
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
      });
  }]).
  config(['$httpProvider','$provide',function($httpProvider,$provide) {
    // $provide.service('Auth',function(){});
    var interceptor = function($q, $rootScope) {
    var deferred = $q.defer();
    return {
      response : function(resp) {
        if(resp.config.url == '/api/users/login') {
          console.log(resp.data.token);
          // Auth.setToken(resp.data.token);
        }
        console.log(resp.config);
        return resp;
      },
      responseError: function(rejection) {
        // Handle errors
        switch(rejection.status) {
          case 401:
            if (rejection.config.url !== 'api/login') {
              // If we're not on the login page
              $rootScope.$broadcast('auth:loginRequired');
            }
            break;
          case 403:
            $rootScope.$broadcast('auth:forbidden');
            break;
          case 404:
            $rootScope.$broadcast('page:notFound');
            break;
          case 500:
            $rootScope.$broadcast('server:error');
            break;
        }
        return $q.reject(rejection);
      }
    };
  };
  $httpProvider.interceptors.push(interceptor);
}]);
