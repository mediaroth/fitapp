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
