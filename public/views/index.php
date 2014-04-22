<!DOCTYPE html>
<html lang="en" ng-app="fitApp">
<head>
  <meta charset="UTF-8">
  <title>in public/views/index.php -  Laravel and Angular exercise System</title>

  <!-- CSS -->
  <link href="packages/bootstrap-3.1.1-dist/css/bootstrap-theme.min.css" rel="stylesheet">
  <!-- Custom styles for this template -->
  <link href="css/style.css" rel="stylesheet">
  <style>
    body    { padding-top:30px; }
    form    { padding-bottom:20px; }
    .exercise  { padding-bottom:20px; }
  </style>
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
  <script src="js/lib/jquery/jquery.min.js" type="text/javascript"></script>
  <script src="js/lib/angular/angular.min.js" type="text/javascript"></script> <!-- load angular -->
  <script src="js/lib/angular/angular-route.min.js" type="text/javascript"></script> <!-- load angular -->
  <script src="js/lib/lodash/dist/lodash.compat.min.js" type="text/javascript"></script>
  <script src="js/lib/restangular/dist/restangular.min.js" type="text/javascript"></script>
  <!-- ANGULAR -->
  <!-- all angular resources will be loaded from the /public folder -->
  <script src="js/app/app.js" type="text/javascript"></script> <!-- load our application -->
  <script src="js/app/services/WorkoutService.js" type="text/javascript"></script>
  <script src="js/app/services/ExerciseService.js" type="text/javascript"></script>
  <script src="js/app/directives/Directives.js" type="text/javascript"></script>
  <script src="js/app/controllers/HomeController.js" type="text/javascript"></script>
  <script src="js/app/controllers/ExerciseController.js" type="text/javascript"></script>
  <script src="js/app/controllers/WorkoutController.js" type="text/javascript"></script>
  

</body>
</html>