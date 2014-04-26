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
