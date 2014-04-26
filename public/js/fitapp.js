/*!
 * fitapp v0.0.1 ()
 * Copyright 2011-2014 mediaroth
 * Licensed under BSD
 */

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

angular.module('fitApp.controllers').
controller('HomeController', function($scope,Auth) {
  $scope.user = Auth.getUser();
  $scope.test = 'Hello World, I\'m so cool ! Maybe even more so !! Oh Yeaahhhh, so jelly right now'
});

angular.module('fitApp.controllers').
controller('UserController', ['$scope','$location','userService',function($scope,$location,userService) {
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
            userService.postLogin($scope.user).then(function(data) {
              console.log(data);
                $scope.success = data.success;
                // redirect to my profile
                $location.path('/myprofile');
            }, function(err) {
              console.log(err);
                $scope.error = err.data.error;
                $scope.errors = err.data.errors;
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

angular.module('fitApp.directives', []).
directive('tableList', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: '/templates/directives/tableList.html',
      // scope: true,
      scope : {
        objects : '=objects',
        edit : '=editFn',
        destroy : '=destroyFn',
        someProp : '@'
      },
      controller: function($scope, $element, $transclude) {
        console.log($scope.objects);
      }
    };
}).
directive('ngFocus', [function() {
  var FOCUS_CLASS = 'ng-focused';
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      ctrl.$focused = false;
      element.bind('focus', function(evt) {
        element.addClass(FOCUS_CLASS);
        scope.$apply(function() {ctrl.$focused = true;});
      }).bind('blur', function(evt) {
        element.removeClass(FOCUS_CLASS);
        scope.$apply(function() {ctrl.$focused = false;});
      });
    }
  };
}]).
  directive('myDirective', function() {
    return {
      // restrict: 'A',
      // replace: true,
      require: '?ngModel',
      template: '<div class="sidebox">\
                    <div class="content">\
                      <h2 class="header">{{ workoutData.name }}</h2>\
                      <span class="content">\
                      {{ workoutData.description }}</span>\
                    </div>\
                  </div>',
      // scope: true,
      // scope : {
      //   title : '@'
      // },
      link: function(scope,ele,attrs,ngModel) {
        if(!ngModel) {
          console.log('no ngModel');
        } else {
          $(function() {
            $('#foo').on('blur',function(e) {
              scope.$apply(function() {
                ngModel.$setViewValue($('#foo').val());
              });
            });
          });
          console.log(ngModel.$viewChangeListeners);
        }
      }
    };
});

angular.module('fitApp.services').
factory('Auth',function($cookieStore, ACCESS_LEVELS) {
  var _user = $cookieStore.get('user');
  var setUser = function(user) {
    if (!user.role || user.role < 0) {
      user.role = ACCESS_LEVELS.pub;
    }
    _user = user;
    $cookieStore.put('user', _user);

  };
  return {
    isAuthorized: function(lvl) {
      if(!_user) {
        if(lvl === 1) {
          return true;
        } else {
          return false;
        }
      }
      return _user.role >= lvl;
    },
    setUser: setUser,
    isLoggedIn: function() {
      return _user ? true : false;
    },
    getUser: function() {
      return _user;
    },
    getId: function() {
      return _user ? _user._id : null;
    },
    getToken: function() {
      return _user ? _user.token : '';
    },
    setToken: function(token) {
      _user.token = token;
    },
    logout: function() {
      $cookieStore.remove('user');
      _user = null;
    }
  };
});

angular.module('fitApp.services').
factory('exerciseService', function(Restangular) {
  var restAngular = Restangular.withConfig(function(Configurer) {
    Configurer.setBaseUrl('/api');
  });
  var _exerciseService = restAngular.all('exercises');
  return {
    getAll: function() {
      return _exerciseService.getList();
    },
    get: function(id) {
      return restAngular.one('exercises',id).get();
    },
    post: function(data) {
      return _exerciseService.post(data);
    },
    put: function(ele) {
      return ele.put();
    },
    destroy: function(id) {
      return restAngular.one('exercises',id).remove();
    }
  };
});

angular.module('fitApp.services').
factory('userService', function(Restangular) {
  var restAngular = Restangular.withConfig(function(Configurer) {
    Configurer.setBaseUrl('/api');
  });
  var _userService = restAngular.all('users');
  return {
    getAll: function() {
      return _userService.getList();
    },
    get: function(id) {
      return restAngular.one('users',id).get();
    },
    post: function(data) {
      return _userService.post(data);
    },
    postLogin: function(data) {
      return _userService.customPOST(data,'login');
    },
    put: function(ele) {
      return ele.put();
    },
    destroy: function(id) {
      return restAngular.one('users',id).remove();
    }
  };
});

angular.module('fitApp.services').
factory('workoutService', function(Restangular) {
  var restAngular = Restangular.withConfig(function(Configurer) {
    Configurer.setBaseUrl('/api');
  });
  var _workoutService = restAngular.all('workouts');
  return {
    getAll: function() {
      return _workoutService.getList();
    },
    get: function(id) {
      return restAngular.one('workouts',id).get();
    },
    post: function(data) {
      return _workoutService.post(data);
    },
    put: function(ele) {
      return ele.put();
    },
    destroy: function(id) {
      return restAngular.one('workouts',id).remove();
    }
  };
});


var test = 'Test';

var fuc = 'foo';
