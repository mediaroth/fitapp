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
