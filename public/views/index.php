<!DOCTYPE html>
<html lang="en" ng-app="fitApp">
<head>
  <meta charset="UTF-8">
  <title>in public/views/index.php -  Laravel and Angular exercise System</title>
  <!-- Custom styles for this template -->
  <link href="/css/fitapp.css" rel="stylesheet">
</head>
<!-- declare our angular app and controller -->
  <body class="container">
    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="/">Fitblaster</a>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class=""><a href="/">Home</a></li>
            <li class=""><a href="/workout">Workouts</a></li>
            <li class=""><a href="/exercise">Exercises</a></li>
            <li class=""><a href="/register">My Profile</a></li>
            <li class=""><a href="/login">Login</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="main" ng-view></div>
      </div>
    </div><!-- /.container -->
  <!-- JS -->
    <script src="/lib/jquery.min.js" type="text/javascript"></script>
    <script src="/lib/angular.min.js" type="text/javascript"></script>
    <script src="/lib/angular-route.min.js" type="text/javascript"></script>
    <script src="/lib/angular-cookies.min.js" type="text/javascript"></script>
    <script src="/lib/lodash.compat.min.js" type="text/javascript"></script>
    <script src="/lib/restangular.min.js" type="text/javascript"></script>
    <script src="/js/fitapp.js" type="text/javascript"></script>
</body>
</html>