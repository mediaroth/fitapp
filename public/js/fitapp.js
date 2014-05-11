/*!
 * fitapp v0.0.1 (https://github.com/mediaroth/fitapp)
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


angular.module('fitApp.controllers').
controller('ExerciseController', ['$scope','exerciseService','$location','$filter',function($scope,exerciseService,$location,$filter) {
    $scope.model = {};
    $scope.model.loading = false;
    $scope.model.form = {};
    $scope.model.form.submitted = false;
    $scope.model.form.errors = [];
    $scope.model.form.success = false;
    $scope.model.record = {};
    $scope.model.list = [];
    $scope.model.table = {};
    $scope.model.table.maxNumPerPage = [3, 5, 10, 20];
    $scope.model.table.currentSortedField = '';
    $scope.model.table.searchKeyword = '';
    $scope.model.table.currentPage = 1;
    $scope.model.table.currentPageData = [];
    $scope.model.table.totalPageData = [];

    $scope.submit = function() {
        $scope.model.form.error = false;
        $scope.model.form.success = false;
        if (!$scope.model.form.$valid) {
            $scope.model.form.submitted = true;
        } else {
            $scope.model.form.submitted = false;
            // $scope.model.form.success = false;
            $scope.model.form.error = false;
            $scope.model.form.loading = true;
            //PUT
            if (!_.isUndefined($scope.model.record.id)) {
                exerciseService.put($scope.model.record).then(function(data) {
                    $scope.model.form.success = data.success;
                    return exerciseService.getAll();
               }).then(function(data) {
                    $scope.model.list = data;
                    $scope.model.loading = false;
                    $scope.model.table.onUpdate();
                }, function(err) {
                    console.log(err);
                });
            } else { // CREATE
                exerciseService.post($scope.model.record).then(function(data) {
                    $scope.model.form.success = data.success;
                                        console.log($scope.model.form.success);
                    return exerciseService.getAll();
                }, function(err) {
                    $scope.model.form.error = err.data.error;
                    $scope.model.form.errors = err.data.errors;
                    return exerciseService.getAll();
                }).finally(function() {
                    // how to implement ?
                }).then(function(data) {
                    $scope.model.list = data;
                    $scope.model.loading = false;
                    $scope.model.table.onUpdate();
                }, function(err) {
                    console.log(err);
                });
            }
        }

    };
    $scope.destroy = function(id) {
        $scope.model.loading = true;
        exerciseService.destroy(id).then(function() {
            return exerciseService.getAll();
        },function(err) {
            console.log(err);
        }).then(function(data) {
            console.log('updated list');
            $scope.model.list = data;
            $scope.model.loading = false;
            $scope.model.table.onUpdate();
        });
    };
    $scope.edit = function(id) {
        $scope.model.form.error = false;
        $scope.model.form.success = false;
        exerciseService.get(id).then(function(data) {
           $scope.model.record = data;
           console.log($scope.model.record);
        });

    };
    $scope.clear = function() {
        $scope.model.form.error = false;
        $scope.model.form.success = false;
        $scope.model.form.submitted = false;
        $scope.model.form.$setPristine();
        $scope.model.record = {};
    };
    $scope.model.table.search = function() {
        $scope.model.table.currentPageData = $scope.model.table.totalPageData = $filter('filter')($scope.model.list, $scope.model.table.searchKeyword);
    };
    $scope.model.table.select = function() {
        var end, start;
        start = ($scope.model.table.currentPage - 1) * $scope.model.table.numPerPage;
        end = start + $scope.model.table.numPerPage;
        $scope.model.table.search();
        $scope.model.table.sort($scope.model.table.currentSortedField);
        $scope.model.table.slice(start,end);
    };
    $scope.model.table.sort = function(field) {
        $scope.model.table.currentSortedField = field;
        $scope.model.table.currentPageData = $filter('orderBy')($scope.model.table.currentPageData, field);
    };
    $scope.model.table.slice = function(start,end) {
        $scope.model.table.currentPageData = $scope.model.table.currentPageData.slice(start,end);
    };
    init = function() {
        exerciseService.getAll().then(function(data) {
            $scope.model.list = data;
            $scope.model.table.search();
            $scope.model.table.currentSortedField = '+id';
            $scope.model.table.sort($scope.model.table.currentSortedField);
            $scope.model.table.numPerPage = $scope.model.table.maxNumPerPage[1];
            $scope.model.table.slice(0,$scope.model.table.numPerPage);
        });
    };
    $scope.model.table.onUpdate = function() {
        $scope.model.table.search();
        $scope.model.table.sort($scope.model.table.currentSortedField);
        $scope.model.table.slice(0,$scope.model.table.numPerPage);
        $scope.model.table.currentPage = 1;
        console.log($scope.model.table.totalPageData)
    };
    $scope.model.table.onSort = function(field) {
        $scope.model.table.search();
        $scope.model.table.sort(field);
        $scope.model.table.slice(0,$scope.model.table.numPerPage);
        $scope.model.table.currentPage = 1;
    }
    return init();
  }]);

angular.module('fitApp.controllers').
controller('HomeController', function($scope) {
  $scope.test = 'Hello World, I\'m so cool ! Maybe even more so !! Oh Yeaahhhh, so jelly right now'
});

angular.module('fitApp.controllers').
controller('TableController', ['$rootScope','$scope','$filter',function($rootScope,$scope,$filter) {
    $scope.table = {};
    $scope.table.data = [
        {
          name: 'Nijiya Market',
          price: '$$',
          sales: 292,
          rating: 4.0
        }, {
          name: 'Eat On Monday Truck',
          price: '$',
          sales: 119,
          rating: 4.3
        }, {
          name: 'Tea Era',
          price: '$',
          sales: 874,
          rating: 4.0
        }, {
          name: 'Rogers Deli',
          price: '$',
          sales: 347,
          rating: 4.2
        }, {
          name: 'MoBowl',
          price: '$$$',
          sales: 24,
          rating: 4.6
        }, {
          name: 'The Milk Pail Market',
          price: '$',
          sales: 543,
          rating: 4.5
        }, {
          name: 'Nob Hill Foods',
          price: '$$',
          sales: 874,
          rating: 4.0
        }, {
          name: 'Scratch',
          price: '$$$',
          sales: 643,
          rating: 3.6
        }, {
          name: 'Gochi Japanese Fusion Tapas',
          price: '$$$',
          sales: 56,
          rating: 4.1
        }, {
          name: 'Cost Plus World Market',
          price: '$$',
          sales: 79,
          rating: 4.0
        }, {
          name: 'Bumble Bee Health Foods',
          price: '$$',
          sales: 43,
          rating: 4.3
        }, {
          name: 'Costco',
          price: '$$',
          sales: 219,
          rating: 3.6
        }, {
          name: 'Red Rock Coffee Co',
          price: '$',
          sales: 765,
          rating: 4.1
        }, {
          name: '99 Ranch Market',
          price: '$',
          sales: 181,
          rating: 3.4
        }, {
          name: 'Mi Pueblo Food Center',
          price: '$',
          sales: 78,
          rating: 4.0
        }, {
          name: 'Cucina Vention',
          price: '$$',
          sales: 163,
          rating: 3.3
        }, {
          name: 'Sufi Coffee Shop',
          price: '$',
          sales: 113,
          rating: 3.3
        }, {
          name: 'Dana Street Roasting',
          price: '$',
          sales: 316,
          rating: 4.1
        }, {
          name: 'Pearl Cafe',
          price: '$',
          sales: 173,
          rating: 3.4
        }, {
          name: 'Posh Bagel',
          price: '$',
          sales: 140,
          rating: 4.0
        }, {
          name: 'Artisan Wine Depot',
          price: '$$',
          sales: 26,
          rating: 4.1
        }, {
          name: 'Hong Kong Chinese Bakery',
          price: '$',
          sales: 182,
          rating: 3.4
        }, {
          name: 'Starbucks',
          price: '$$',
          sales: 97,
          rating: 3.7
        }, {
          name: 'Tapioca Express',
          price: '$',
          sales: 301,
          rating: 3.0
        }, {
          name: 'House of Bagels',
          price: '$',
          sales: 82,
          rating: 4.4
        }
      ];
    $scope.table.maxNumPerPage = [3, 5, 10, 20];
    $scope.table.currentSortedField = '';
    $scope.table.searchKeyword = '';
    $scope.table.currentPage = 1;
    $scope.table.currentPageData = [];
    $scope.table.totalPageData = [];

    $scope.table.search = function() {
        $scope.table.currentPageData = $scope.table.totalPageData = $filter('filter')($scope.table.data, $scope.table.searchKeyword);
    };
    $scope.table.select = function() {
        var end, start;
        start = ($scope.table.currentPage - 1) * $scope.table.numPerPage;
        end = start + $scope.table.numPerPage;
        $scope.table.search();
        $scope.table.sort($scope.table.currentSortedField);
        $scope.table.slice(start,end);
    };
    $scope.table.sort = function(field) {
        $scope.table.currentSortedField = field;
        $scope.table.currentPageData = $filter('orderBy')($scope.table.currentPageData, field);
    };
    $scope.table.slice = function(start,end) {
        $scope.table.currentPageData = $scope.table.currentPageData.slice(start,end);
    };
    init = function() {
        $scope.table.search();
        $scope.table.currentSortedField = '+name';
        $scope.table.sort($scope.table.currentSortedField);
        $scope.table.numPerPage = $scope.table.maxNumPerPage[1];
        $scope.table.slice(0,$scope.table.numPerPage);
    };
    $scope.table.onUpdate = function() {
        $scope.table.search();
        $scope.table.sort($scope.table.currentSortedField);
        $scope.table.slice(0,$scope.table.numPerPage);
        $scope.table.currentPage = 1;
        console.log($scope.table.totalPageData)
    };
    $scope.table.onSort = function(field) {
        $scope.table.search();
        $scope.table.sort(field);
        $scope.table.slice(0,$scope.table.numPerPage);
        $scope.table.currentPage = 1;
    }
    return init();
}]);

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
directive('mrSetFocus', function() {
  return {
    restrict: 'A',
    controller: ['$scope', '$element', '$attrs', '$location', function($scope, $element, $attrs, $location) {
      // element is li
      // set active class if li pointing route === current route
      var navRoutes,elePath;
      navRoutes = $element.find('a');
      currentPath = function() {
        return $location.path();
      };
      setFocus = function(currentPath) {
        navRoutes.each(function() {
          var $ele = $(this);
          var elePath = $ele.attr('href');
          if (elePath === currentPath) {
            $ele.parent('li').addClass('active');
          } else {
            $ele.parent('li').removeClass('active');
          }
        })
      };
      setFocus(currentPath());
      return $scope.$watch(currentPath, function(newVal, oldVal) {
        if (newVal === oldVal) {
          return;
        }
        setFocus(newVal);
      });
    }]
  }
}).
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
        // console.log($scope.objects);
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
directive('mrToggleMinNav', ['$rootScope', function($rootScope) {
    return {
      restrict: 'A',
      link: function(scope,ele,attrs) {
        var app;
        app = $('#app');
        ele.on('click', function(e) {
          if (app.hasClass('nav-min')) {
              app.removeClass('nav-min');
          } else {
            app.addClass('nav-min');
            $rootScope.$broadcast('minNav:enabled');
          }
          return e.preventDefault();
        });
      }
    };
}]).directive('mrCollapseNav', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          var $a, $aRest, $lists, $listsRest, app, duration;
          duration = 200;
          $lists = ele.find('ul').parent('li');
          $lists.append('<i class="fa fa-caret-right icon-has-ul"></i>');
          $a = $lists.children('a');
          // the ones without subnavs
          $listsRest = ele.children('li').not($lists);
          $aRest = $listsRest.children('a');
          app = $('#app');
          $a.on('click',function(event) {
            var $this, $parent;
            if (app.hasClass('nav-min')) {
              return false;
            }
            $this = $(this);
            $parent = $this.parent('li');
            // close all other panels
            $lists.not($parent).removeClass('open').find('ul').slideUp(duration);
            $parent.toggleClass('open').find('ul').slideToggle(duration);
            return event.preventDefault();
          });
          $aRest.on('click', function(event) {
            return $lists.removeClass('open').find('ul').slideUp(duration);
          });
          return scope.$on('minNav:enabled', function(event) {
            return $lists.removeClass('open').find('ul').slideUp();
          });
        }
      };
    }
]).directive('mrCustomBackground', function() {
    return {
      restrict: 'A',
      controller: [
        '$scope', '$element', '$location', function($scope, $element, $location) {
          var addBg, path;
          path = function() {
            return $location.path();
          };
          addBg = function(path) {
            $element.removeClass('body-home body-special body-tasks body-lock');
            switch (path) {
              case '/':
                return $element.addClass('body-home');
              case '/404':
              case '/pages/500':
              case '/login':
              case '/register':
                return $element.addClass('body-special');
              case '/pages/lock-screen':
                return $element.addClass('body-special body-lock');
              case '/tasks':
                return $element.addClass('body-tasks');
            }
          };
          addBg($location.path());
          return $scope.$watch(path, function(newVal, oldVal) {
            if (newVal === oldVal) {
              return;
            }
            return addBg($location.path());
          });
        }
      ]
    };
}).directive('mrMsgBox', function() {
    return {
      restrict: 'A',
      scope : {
        body : '@',
        title : '@',
        onConfirm : '&confirm'
      },
      link: function(scope, ele, attrs)  {
        // console.log( scope.onConfirm);
        ele.on('click', function(e) {
                  var id = 15;
          var $msgbox = $('.msg-box');
          $('.msg-box .title').html(scope.title);
          $('.msg-box .body').html(scope.body);
          $('.msg-box .cancel').unbind().on('click', function(e) {
            $msgbox.fadeOut(200);
          })
          $('.msg-box .ok').unbind().on('click', function() {
            scope.onConfirm();
            $msgbox.fadeOut(200);
          });
          $msgbox.fadeIn(200);
        });
      }
    };
});

angular.module('fitApp.services').
provider('auth', function() {
  // var _user;
  var _user = {};
  this.setToken = function(token) {
    console.log('in setToken');
    _user.token = token;
    console.log(_user);
  };
  this.setUser = function(user) {
    console.log('setUser');
    _user = user
  };
  // return {
  //   // setToken: function(token) {
  //   //   console.log('in setToken');
  //   //   this._user.token = token;
  //   //   console.log(_user);
  //   // },
  //   setUser : function(user) {
  //     console.log('in setUser');
  //       if (!user.role || user.role < 0) {
  //         user.role = ACCESS_LEVELS.pub;
  //       }
  //       _user = user;
  //       console.log(_user);
  //       // $cookieStore.put('user', _user);
  //   },
    this.$get = function(userService) {
      // var _user = $cookieStore.get('user');
      return {
        // user : _user
        // // setToken: function(token) {
        // //   _user.token = token;
        // // },
        // // setToken : setToken,
        isAuthorized: function(lvl) {
          // no user logged in, assign role of public = 1
          return false;
        },
        // // setUser: setUser,
        // isLoggedIn: function() {
        //   return _user ? true : false;
        // },
        getUser: function() {
          console.log('in get user');
          return _user;
        },
        // getId: function() {
        //   return _user ? _user._id : null;
        // },
        getToken: function() {
          return _user;
        },
        // logout: function() {
        //   // $cookieStore.remove('user');
        //   _user = null;
        // }
      };
    // }
  }
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
factory('userService', function($rootScope,$window,$location,$q,$http,Restangular) {
  var restAngular = Restangular.withConfig(function(Configurer) {
    Configurer.setBaseUrl('/api');
  });
  var _userService = restAngular.all('users');
  var user = {};
  return {
    getAll: function() {
      return _userService.getList();
    },
    get: function(id) {
      return restAngular.one('users',id).get();
    },
    getUser: function(id) {
      if (!user) {
        console.log('http');
        $http
        .get('/auth')
        .success(function(data,status,headers,config) {
            $window.sessionStorage.token = data.token;
            // user = data.user;
            console.log('http');
            user = data.user;
            return data.user;
        })
        .error(function(data,status,headers,config) {
            delete $window.sessionStorage.token;
            console.log('error');
        });
      }
      return user;
    },
    checkUser: function(lvl) {
        return $http
        .get('/auth')
        .success(function(data,status,headers,config) {
          if (data.error) {
            $q.reject(data);
          } else {
            user = data;
            $rootScope.authorized = true;
            if (lvl <= user.role) {
             } else {
              $q.reject(data);
            }
          }
        })
        .error(function(data,status,headers,config) {
          console.log('in checkUser error');
          delete $window.sessionStorage.token;
          $location.path('/login');
          $q.reject(data);
        });
    },
    post: function(data) {
      return _userService.post(data);
    },
    postLogin: function(data) {
      return _userService.customPOST(data,'login');
    },
    postAuth: function(data) {
      return $http
        .post('/auth',data)
        .success(function(data,status,headers,config) {
            $window.sessionStorage.token = data.token;
            $rootScope.authorized = true;
            user = data.user;
            return true;
        })
        .error(function(data,status,headers,config) {
          console.log(data);
            delete $window.sessionStorage.token;
            $q.reject();
        });
    },
    logout: function() {
        var deferred = $q.defer();
        delete $window.sessionStorage.token;
        $rootScope.authorized = false;
        user = {};
        deferred.resolve();
        return deferred.promise;
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

