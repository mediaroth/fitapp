angular.module('fitApp.controllers').
controller('TableController', ['$rootScope','$scope','$filter',function($rootScope,$scope,$filter) {
    $scope.table = {};
    $scope.table.data = [
        {
          name: 'Nijiya Market',
          price: '$$',
          sales: 292,
          rating: 4.0
        }, {
          name: 'Eat On Monday Truck',
          price: '$',
          sales: 119,
          rating: 4.3
        }, {
          name: 'Tea Era',
          price: '$',
          sales: 874,
          rating: 4.0
        }, {
          name: 'Rogers Deli',
          price: '$',
          sales: 347,
          rating: 4.2
        }, {
          name: 'MoBowl',
          price: '$$$',
          sales: 24,
          rating: 4.6
        }, {
          name: 'The Milk Pail Market',
          price: '$',
          sales: 543,
          rating: 4.5
        }, {
          name: 'Nob Hill Foods',
          price: '$$',
          sales: 874,
          rating: 4.0
        }, {
          name: 'Scratch',
          price: '$$$',
          sales: 643,
          rating: 3.6
        }, {
          name: 'Gochi Japanese Fusion Tapas',
          price: '$$$',
          sales: 56,
          rating: 4.1
        }, {
          name: 'Cost Plus World Market',
          price: '$$',
          sales: 79,
          rating: 4.0
        }, {
          name: 'Bumble Bee Health Foods',
          price: '$$',
          sales: 43,
          rating: 4.3
        }, {
          name: 'Costco',
          price: '$$',
          sales: 219,
          rating: 3.6
        }, {
          name: 'Red Rock Coffee Co',
          price: '$',
          sales: 765,
          rating: 4.1
        }, {
          name: '99 Ranch Market',
          price: '$',
          sales: 181,
          rating: 3.4
        }, {
          name: 'Mi Pueblo Food Center',
          price: '$',
          sales: 78,
          rating: 4.0
        }, {
          name: 'Cucina Vention',
          price: '$$',
          sales: 163,
          rating: 3.3
        }, {
          name: 'Sufi Coffee Shop',
          price: '$',
          sales: 113,
          rating: 3.3
        }, {
          name: 'Dana Street Roasting',
          price: '$',
          sales: 316,
          rating: 4.1
        }, {
          name: 'Pearl Cafe',
          price: '$',
          sales: 173,
          rating: 3.4
        }, {
          name: 'Posh Bagel',
          price: '$',
          sales: 140,
          rating: 4.0
        }, {
          name: 'Artisan Wine Depot',
          price: '$$',
          sales: 26,
          rating: 4.1
        }, {
          name: 'Hong Kong Chinese Bakery',
          price: '$',
          sales: 182,
          rating: 3.4
        }, {
          name: 'Starbucks',
          price: '$$',
          sales: 97,
          rating: 3.7
        }, {
          name: 'Tapioca Express',
          price: '$',
          sales: 301,
          rating: 3.0
        }, {
          name: 'House of Bagels',
          price: '$',
          sales: 82,
          rating: 4.4
        }
      ];
    $scope.table.maxNumPerPage = [3, 5, 10, 20];
    $scope.table.currentSortedField = '';
    $scope.table.searchKeyword = '';
    $scope.table.currentPage = 1;
    $scope.table.currentPageData = [];
    $scope.table.totalPageData = [];

    $scope.table.search = function() {
        $scope.table.currentPageData = $scope.table.totalPageData = $filter('filter')($scope.table.data, $scope.table.searchKeyword);
    };
    $scope.table.select = function() {
        var end, start;
        start = ($scope.table.currentPage - 1) * $scope.table.numPerPage;
        end = start + $scope.table.numPerPage;
        $scope.table.search();
        $scope.table.sort($scope.table.currentSortedField);
        $scope.table.slice(start,end);
    };
    $scope.table.sort = function(field) {
        $scope.table.currentSortedField = field;
        $scope.table.currentPageData = $filter('orderBy')($scope.table.currentPageData, field);
    };
    $scope.table.slice = function(start,end) {
        $scope.table.currentPageData = $scope.table.currentPageData.slice(start,end);
    };
    init = function() {
        $scope.table.search();
        $scope.table.currentSortedField = '+name';
        $scope.table.sort($scope.table.currentSortedField);
        $scope.table.numPerPage = $scope.table.maxNumPerPage[1];
        $scope.table.slice(0,$scope.table.numPerPage);
    };
    $scope.table.onUpdate = function() {
        $scope.table.search();
        $scope.table.sort($scope.table.currentSortedField);
        $scope.table.slice(0,$scope.table.numPerPage);
        $scope.table.currentPage = 1;
        console.log($scope.table.totalPageData)
    };
    $scope.table.onSort = function(field) {
        $scope.table.search();
        $scope.table.sort(field);
        $scope.table.slice(0,$scope.table.numPerPage);
        $scope.table.currentPage = 1;
    }
    return init();
}]);
