"use strict";

define(['angularAMD', 'angular-route','ngProgress'], function (angularAMD) {
  var app = angular.module("mainModule", ['ngRoute','ngProgress']);

  app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider            
    .when("/", angularAMD.route({
     templateUrl:'Default/Default.html'

   })).when("/index.html", angularAMD.route({
     templateUrl: 'Default/Default.html'
   }))
   .when("/Products.html", angularAMD.route({
    templateUrl: 'Products/Products.html',
    controllerUrl: "Products/ProductsController"

  })).when("/Companies.html", angularAMD.route({

    templateUrl: 'Companies/Companies.html',
    controllerUrl: "Companies/CompaniesController"

  })).when("/AboutUs.html", angularAMD.route({

    templateUrl: 'AboutUS.html'

  })).when("/ContactUs.html", angularAMD.route({

    templateUrl:'ContactUS.html'

  })).when("/Registration.html", angularAMD.route({

    templateUrl: 'Registration/Registration.html',
    controllerUrl: "Registration/RegistrationController"

  })).when("/MyProfile.html", angularAMD.route({

    templateUrl: 'MyProfile/MyProfile.html',
    controllerUrl: "MyProfile/MyProfileController"

  })).when("/ThankYou.html", angularAMD.route({

    templateUrl: 'ThankYou/ThankYou.html',
  }))
  .otherwise({ redirectTo: '/' });

  $locationProvider.html5Mode(true);
}]);

app.controller('indexController', ['$scope', '$http','ngProgress', function ($scope, $http,ngProgress) {
  $scope.CompanyName = "";
  $scope.loginStatus = "";      
  $scope.LoginData = {};

  $http.get('/getLoginStatus').
  success(function (data, status, headers, config) {
      $scope.loginStatus = data.status;
      $scope.PackagingTypes = data.filters.packagingType;
      $scope.categories = data.filters.productlist;
    if (data.userData) {
        $scope.CompanyName = data.userData.ComName;
        
    }
  }).
  error(function (data, status, headers, config) {

  });

  $scope.ProgressBar = function () {
    ngProgress.start();
    return;
  };

  $scope.$on('$viewContentLoaded', function () {
    ngProgress.complete();            
  });

  $scope.LoginFormSubmit = function () {
    $http.post('/login', $scope.LoginData)
    .success(function (data) {
     if (data.err) {
       alert('Error getting data. Please try again..'); return;
     }
     if (data.message === "Wrong password") {
       $('.error').html('<h5 style="color:red;margin:0">Password is wrong..Please try again</h5>');
     }
     if (data.message === "NotExists") {
       $('.error').html('<h5 style="color:red;margin:0">Username does not exists</h5>');
     }
     
     if (data.message === "NotVerified") {
       $('.error').html('<h5 style="color:red;margin:0">Your account is not Verified. Please verify your account.</h5>');
     }
     if (data.message === "Exists") {
       window.location.reload();
     }
   })
    .error(function (data, status, headers, config) {
    });
  }

  $scope.ForgotPassFormSubmit = function () {
    $http.post("/forgotPassword", $scope.ForgotPassData)
    .success(function (data) {
      if (data.message === 'success') {
        $('#forgotPassword').parent().hide();
        $('#message').show();
        $('.modal - footer').hide();
      }
      if (data.message === 'NotFound') {
        $('.frgtPassError').html('<h5 style="color:red;margin:0">Email Not Found. Please Enter a correct Email Address.</h5>');
        $('#email').focus();
        return false;
      }
    })
    .error(function (data, status, headers, config) {

    });
  }

  $scope.logout = function () {
    $http.get('/logout').
    success(function (data, status, headers, config) {                     
     window.location.assign('index.html');
   }).
    error(function (data, status, headers, config) {

    });
  }
}])

angularAMD.bootstrap(app);


return app;
});