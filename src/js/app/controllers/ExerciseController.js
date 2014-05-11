
angular.module('fitApp.controllers').
controller('ExerciseController', ['$scope','exerciseService','$location','$filter',function($scope,exerciseService,$location,$filter) {
    $scope.model = {};
    $scope.model.loading = false;
    $scope.model.form = {};
    $scope.model.form.submitted = false;
    $scope.model.form.errors = [];
    $scope.model.form.success = false;
    $scope.model.record = {};
    $scope.model.list = [];
    $scope.model.table = {};
    $scope.model.table.maxNumPerPage = [3, 5, 10, 20];
    $scope.model.table.currentSortedField = '';
    $scope.model.table.searchKeyword = '';
    $scope.model.table.currentPage = 1;
    $scope.model.table.currentPageData = [];
    $scope.model.table.totalPageData = [];

    $scope.submit = function() {
        $scope.model.form.error = false;
        $scope.model.form.success = false;
        if (!$scope.model.form.$valid) {
            $scope.model.form.submitted = true;
        } else {
            $scope.model.form.submitted = false;
            // $scope.model.form.success = false;
            $scope.model.form.error = false;
            $scope.model.form.loading = true;
            //PUT
            if (!_.isUndefined($scope.model.record.id)) {
                exerciseService.put($scope.model.record).then(function(data) {
                    $scope.model.form.success = data.success;
                    return exerciseService.getAll();
               }).then(function(data) {
                    $scope.model.list = data;
                    $scope.model.loading = false;
                    $scope.model.table.onUpdate();
                }, function(err) {
                    console.log(err);
                });
            } else { // CREATE
                exerciseService.post($scope.model.record).then(function(data) {
                    $scope.model.form.success = data.success;
                                        console.log($scope.model.form.success);
                    return exerciseService.getAll();
                }, function(err) {
                    $scope.model.form.error = err.data.error;
                    $scope.model.form.errors = err.data.errors;
                    return exerciseService.getAll();
                }).finally(function() {
                    // how to implement ?
                }).then(function(data) {
                    $scope.model.list = data;
                    $scope.model.loading = false;
                    $scope.model.table.onUpdate();
                }, function(err) {
                    console.log(err);
                });
            }
        }

    };
    $scope.destroy = function(id) {
        $scope.model.loading = true;
        exerciseService.destroy(id).then(function() {
            return exerciseService.getAll();
        },function(err) {
            console.log(err);
        }).then(function(data) {
            console.log('updated list');
            $scope.model.list = data;
            $scope.model.loading = false;
            $scope.model.table.onUpdate();
        });
    };
    $scope.edit = function(id) {
        $scope.model.form.error = false;
        $scope.model.form.success = false;
        exerciseService.get(id).then(function(data) {
           $scope.model.record = data;
           console.log($scope.model.record);
        });

    };
    $scope.clear = function() {
        $scope.model.form.error = false;
        $scope.model.form.success = false;
        $scope.model.form.submitted = false;
        $scope.model.form.$setPristine();
        $scope.model.record = {};
    };
    $scope.model.table.search = function() {
        $scope.model.table.currentPageData = $scope.model.table.totalPageData = $filter('filter')($scope.model.list, $scope.model.table.searchKeyword);
    };
    $scope.model.table.select = function() {
        var end, start;
        start = ($scope.model.table.currentPage - 1) * $scope.model.table.numPerPage;
        end = start + $scope.model.table.numPerPage;
        $scope.model.table.search();
        $scope.model.table.sort($scope.model.table.currentSortedField);
        $scope.model.table.slice(start,end);
    };
    $scope.model.table.sort = function(field) {
        $scope.model.table.currentSortedField = field;
        $scope.model.table.currentPageData = $filter('orderBy')($scope.model.table.currentPageData, field);
    };
    $scope.model.table.slice = function(start,end) {
        $scope.model.table.currentPageData = $scope.model.table.currentPageData.slice(start,end);
    };
    init = function() {
        exerciseService.getAll().then(function(data) {
            $scope.model.list = data;
            $scope.model.table.search();
            $scope.model.table.currentSortedField = '+id';
            $scope.model.table.sort($scope.model.table.currentSortedField);
            $scope.model.table.numPerPage = $scope.model.table.maxNumPerPage[1];
            $scope.model.table.slice(0,$scope.model.table.numPerPage);
        });
    };
    $scope.model.table.onUpdate = function() {
        $scope.model.table.search();
        $scope.model.table.sort($scope.model.table.currentSortedField);
        $scope.model.table.slice(0,$scope.model.table.numPerPage);
        $scope.model.table.currentPage = 1;
        console.log($scope.model.table.totalPageData)
    };
    $scope.model.table.onSort = function(field) {
        $scope.model.table.search();
        $scope.model.table.sort(field);
        $scope.model.table.slice(0,$scope.model.table.numPerPage);
        $scope.model.table.currentPage = 1;
    }
    return init();
  }]);
