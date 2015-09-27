"use strict";

define(['app', 'ng-file-upload'], function (app) {
    app.register.controller('RegistrationController', ['$scope', '$http', 'Upload', function ($scope, $http, Upload) {
        $scope.states = ['Select a State', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        $scope.certificates = ['BRC', 'SQF Level 1', 'SQF Level 2', 'SQF Level 3', 'AIB', 'GMP', 'USDA', 'ISO', 'IFS', 'ISO22000 FSSC'];
        $scope.RegistrationData = {};
        $scope.RegistrationData.certificates = [];

        $scope.Industries = {};

        $scope.Industries = $scope.$parent.$parent.categories;

        $http.get('/getLoginStatus').
            success(function (data, status, headers, config) {
                if (data.status === 'login') {
                    window.location.assign('index.html');
                }
            }).
            error(function (data, status, headers, config) {

            });

        $scope.certCheck = function () {
            var CertObject = {};
            CertObject.name = $scope.certificates[this.$index];
            CertObject.path = "";

            if (this.Cert) {
                $scope.RegistrationData.certificates.push(CertObject);
            } else {
                angular.forEach($scope.RegistrationData.certificates, function (value, key) {
                    if (angular.equals(CertObject, value)) {
                        $scope.RegistrationData.certificates.splice(key, 1);
                    }
                })
            }
        }

        $scope.change = function () {

            if ($scope.sameAsAbove === true) {

                if ($scope.RegistrationData.CompanyAddress ) {
                    $scope.RegistrationData.ContactAddress = $scope.RegistrationData.CompanyAddress;
                }
                else {
                    alert('Please fill Company Address');
                    $scope.sameAsAbove = false;
                    $('input[ng-model="RegistrationData.CompanyAddress"]').focus();
                    $('input[ng-model="RegistrationData.CompanyAddress"]').select();
                    return;
                }

                if ($scope.RegistrationData.CompanyCity) {
                    $scope.RegistrationData.ContactCity = $scope.RegistrationData.CompanyCity;
                }
                else {
                    alert('Please fill Company City');
                    $scope.sameAsAbove = false;
                    $('input[ng-model="RegistrationData.CompanyCity"]').focus();
                    $('input[ng-model="RegistrationData.CompanyCity"]').select();
                    return;
                }

                if ($scope.RegistrationData.CompanyZip) {
                    $scope.RegistrationData.ContactZip = $scope.RegistrationData.CompanyZip;

                } else {
                    alert('Please fill Comapny Zip');
                    $scope.sameAsAbove = false;
                    $('input[ng-model="RegistrationData.CompanyZip"]').focus();
                    $('input[ng-model="RegistrationData.CompanyZip"]').select();
                    return;
                }

                if ($scope.RegistrationData.CompanyState && $scope.RegistrationData.CompanyState !== "Select a State") {
                    $scope.RegistrationData.ContactState = $scope.RegistrationData.CompanyState;

                } else {
                    alert('Please fill Company State');
                    $scope.sameAsAbove = false;
                    $('select[ng-model="RegistrationData.CompanyState"]').focus();
                    $('select[ng-model="RegistrationData.CompanyState"]').select();
                    return;
                }

                if ($scope.RegistrationData.CompanyCountry && $scope.RegistrationData.CompanyCountry !== "") {
                    $scope.RegistrationData.ContactCountry = $scope.RegistrationData.CompanyCountry;

                } else {
                    alert('Please fill Company Country');
                    $scope.sameAsAbove = false;
                    $('select[ng-model="RegistrationData.CompanyCountry"]').focus();
                    $('select[ng-model="RegistrationData.CompanyCountry"]').select();
                    return;
                }
            } else {
                $scope.RegistrationData.ContactState = "";
                $scope.RegistrationData.ContactZip = "";
                $scope.RegistrationData.ContactCity = "";
                $scope.RegistrationData.ContactAddress = "";
            }
        };

        $scope.upload = function ($file) {
            $scope.logo = $file;
        }

        $scope.RegisterFormSubmit = function () {

            if ($scope.RegistrationData.Industry === 'Select an Industry' || $scope.RegistrationData.Industry === undefined) {
                alert('Please select an Industry');
                return;
            }
            if ($scope.RegistrationData.ContactState === 'Select a State') {
                alert('Please select a State');
                return;
            }
            if ($scope.RegistrationData.ContactState === 'Select a State') {
                alert('Please select a State');
                return;
            }
            if ($scope.PrimaryPhone==='--Select--') {
                alert('Please select a Primary Number');
                return;
            };

            $scope.RegistrationData.PrimaryNumber=$scope.PrimaryPhone;

            Upload.upload({
                url: '/RegisterCompany',
                fields: $scope.RegistrationData,
                file: $scope.logo
            }).success(function (data, status, headers, config) {

                console.log('Success');
                if (data.status === 'Success') {
                    window.location.href = "/#ThankYou.html";
                } else if (data.code === 'EEXIST') {
                    alert('Companies name already registered');
                    return;
                }
            }).error(function (data, status, headers, config) {
                console.log('error status: ' + status);
            })
        };
    }]);
});
