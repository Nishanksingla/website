"use strict";

define(['app','ngProgress'], function (app) {
    app.register.controller('ProductsController', ['$scope', '$http', 'ngProgress', function ($scope, $http, ngProgress) {
        $scope.hide_show = [];
        $scope.productFilter = {};
        $scope.packagingFilter = [];
        $scope.sizesList = ["1 to 8 Oz", "9 to 16 Oz", "17 to 32 Oz", "33 to 127 Oz", "1 to 5 gal", "More than 5 gal"];
        var query = { category: {}, size: [], packagingType: [] };


        var getProductData = function () {
            ngProgress.start();
            debugger
            $http.get('/product/' + JSON.stringify(query)).
              success(function (Products, status, headers, config) {
                  debugger
                  $scope.products = Products;
                  $scope.productCount = Products.length;
                  ngProgress.complete();
              }).
              error(function (data, status, headers, config) {

              });
        }


        

        var currentUrl = window.location.href;
        if (currentUrl.indexOf('?') > 0 && currentUrl.indexOf('=') > 0) {
            var categoryVal = currentUrl.split('=').pop();
            
            query.category[categoryVal] = [];
            $scope.productFilter = $scope.$parent.$parent.categories;
            $scope.packagingFilter = $scope.$parent.$parent.PackagingTypes;
            debugger
            getProductData();

        } else {
            ngProgress.start();
            $http.get('/product').
              success(function (data, status, headers, config) {
                  $scope.products = data.products;
                  $scope.productCount = data.products.length;
                  $scope.productFilter = data.filters[0].productlist;
                  $scope.packagingFilter = data.filters[0].packagingType;
                  ngProgress.complete();
              }).
              error(function (data, status, headers, config) {
              
              });
        }
        $scope.notEmptyOrNull = function (item) {
            return !(item === null || item.trim().length === 0)
        }

        $scope.productSelection = function ($index) {
            $scope.hide_show[$index] = !$scope.hide_show[$index];

            var categoryVal = this.category !== undefined ? this.category : " ";
            var nameVal = this.name !== undefined ? this.name : " ";
            var packingVal = this.packing !== undefined ? this.packing : " ";
            var sizeVal = this.size !== undefined ? this.size : " ";
            if (this.categoryChkbx === true) {
                if (query["category"][categoryVal] === undefined) {
                    query["category"][categoryVal] = [];
                }
                if (this.nameChkbx === true) {
                    query["category"][categoryVal].push(nameVal);
                }
            } else if (this.packingChkbx === true) {
                query["packagingType"].push(packingVal);
            } else if (this.sizeChkbx === true) {
                query["size"].push(sizeVal);
            }

            if (this.categoryChkbx === false) {
                $('input[value="' + categoryVal + '"]').next().find('input[type="checkbox"]').attr('checked', false);
                delete query["category"][categoryVal];
            }
            if (this.nameChkbx === false) {
                var index = query['category'][categoryVal].indexOf(nameVal);
                query['category'][categoryVal].splice(index, 1);
            }

            if (this.packingChkbx === false) {
                var index = (query["packagingType"]).indexOf(packingVal);
                (query["packagingType"]).splice(index, 1);
            }
            if (this.sizeChkbx === false) {
                var index = (query["size"]).indexOf(sizeVal);
                (query["size"]).splice(index, 1);
            }
            getProductData();
        };

        $scope.clearAllProducts = function () {

            query.category = {};
            getProductData();
            $scope.hide_show = [];
            $('input[ng-model="categoryChkbx"]').attr('checked', false);
            $('input[ng-model="nameChkbx"]').attr('checked', false);
        }
        $scope.clearAllPackaging = function () {

            query.packagingType = [];
            getProductData();
            $('input[ng-model="packingChkbx"]').attr('checked', false);
        }
        $scope.clearAllSizes = function () {
            query.size = [];
            getProductData();
            $('input[ng-model="sizeChkbx"]').attr('checked', false);
        }

    }]);
});


