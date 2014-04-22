angular.module('fitApp.services').
factory('workoutService', function(Restangular){
  var restAngular = Restangular.withConfig(function(Configurer){
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
