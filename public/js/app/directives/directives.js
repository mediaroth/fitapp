angular.module('fitApp.directives', []).
directive('tableList', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'js/app/directives/templates/tableList.html',
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
  var FOCUS_CLASS = "ng-focused";
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
          console.log("no ngModel");
        } else {
          $(function() {
            $('#foo').on('blur',function(e){
              scope.$apply(function(){
                ngModel.$setViewValue($('#foo').val());
              });
            });
          });
          console.log(ngModel.$viewChangeListeners);
        }
      }
    };
});