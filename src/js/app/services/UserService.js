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
