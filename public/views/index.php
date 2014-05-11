<!DOCTYPE html>
<html lang="en" data-ng-app="fitApp">
<head>
  <meta charset="UTF-8">
  <title>in public/views/index.php -  Laravel and Angular exercise System</title>
  <!-- Custom styles for this template -->
  <link href="/bower_components/font-awesome/css/font-awesome.min.css" rel="stylesheet">
  <link href="/css/fitapp.css" rel="stylesheet">
</head>
<!-- declare our angular app and controller -->
  <body data-mr-custom-background id="app" data-ng-cloak>
    <!--[if lt IE 9]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->
    <div>
        <div data-ng-hide="isSpecificPage()">
            <section data-ng-include=" '/templates/header.html' "
                 id="header" class="top-header"></section>
            <aside data-ng-include=" '/templates/nav.html' "
                 id="nav-container"></aside>
        </div>

        <div class="view-container">
            <section data-ng-view id="content" class="animate-fade-up"></section>
        </div>
    </div>
    <!-- /.container -->
  <!-- overlay -->
  <div class="msg-box">
    <div class="container">
      <div class="center">
        <span class="title"></span>
        <p class="body"></p>
        <div class="buttons">
          <button class="cancel btn btn-primary btn-sm"> No</button>
          <button class="ok btn btn-primary btn-sm"> Yes</button>
        </div>
      </div>
    </div>
  </div>
  <div class="cloak" ng-show="loadingView">
  <!-- loadingView is a variable defined in the $rootScope -->

  <!-- The loading animation is inspired by http://codepen.io/joni/details/FiKsd -->
  <ul id="loading">
    <li class="bar" ng-repeat="i in [0,1,2,3,4,5,6,7,8,9]"></li>
  </ul>
</div>
  <!-- bower:js -->
  <script src="../bower_components/jquery/dist/jquery.js"></script>
  <script src="../bower_components/bootstrap/dist/js/bootstrap.js"></script>
  <script src="../bower_components/angular/angular.js"></script>
  <script src="../bower_components/angular-route/angular-route.js"></script>
  <script src="../bower_components/angular-cookies/angular-cookies.js"></script>
  <script src="../bower_components/angular-animate/angular-animate.js"></script>
  <script src="../bower_components/lodash/dist/lodash.compat.js"></script>
  <script src="../bower_components/restangular/dist/restangular.js"></script>
  <script src="../bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
  <script src="../bower_components/underscore/underscore.js"></script>
  <!-- endbower -->

  <!-- dist -->
  <script src="/js/fitapp.js" type="text/javascript"></script>
  <!-- dev -->
  
  <!-- JS -->
   <!--  // <script src="/lib/jquery.min.js" type="text/javascript"></script>
    // <script src="/lib/angular.min.js" type="text/javascript"></script>
    // <script src="/lib/angular-route.min.js" type="text/javascript"></script>
    // <script src="/lib/angular-cookies.min.js" type="text/javascript"></script>
    // <script src="/lib/angular-animate.min.js" type="text/javascript"></script>
    // <script src="/lib/lodash.compat.min.js" type="text/javascript"></script>
    // <script src="/lib/restangular.min.js" type="text/javascript"></script>
    // <script src="/lib/ui-bootstrap.js" type="text/javascript"></script>
    // <script src="/lib/ui-bootstrap-tpls.js" type="text/javascript"></script>
    // <script src="/js/fitapp.js" type="text/javascript"></script> -->
</body>
</html>