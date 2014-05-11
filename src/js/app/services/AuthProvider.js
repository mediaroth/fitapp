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
