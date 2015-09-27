"use strict";

define(['app','ngProgress'], function (app) {
    app.register.controller('CompaniesController', ['$scope', '$http', 'ngProgress', function ($scope, $http, ngProgress) {
    var company = {
        certificate: [],
        state: []
    };
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    $scope.certificates = ["BRC", "SQF Level 1", "SQF Level 2", "SQF Level 3", "AIB", "GMP", "USDA", "ISO", "IFS", "ISO22000 FSSC", "kosher"];

    var getCompany = function (url) {
        ngProgress.start();
        $http.get(url).
        success(function (data, status, headers, config) {
            $scope.companies = data.companies;
            $scope.companyCount = data.companies.length;
            //$scope.loginStatus = data.status;
            //if (data.userData) {
            //    $scope.userData = data.userData;
            //}
            ngProgress.complete();
        }).
        error(function (data, status, headers, config) {

        });
    }

    var productID = window.location.href.split('=')[1];
    if (productID) {
        getCompany("/getCompanies/" + productID);
    } else {
        getCompany("/companies/");
    }

    $scope.selectCompany = function () {
        if (this.stateChkbx === true) {
            company.state.push(this.state);

        } else if (this.stateChkbx === false) {

            var index = company.state.indexOf(this.state);
            company.state.splice(index, 1);
        }

        if (this.certificateChkbx === true) {

            company.certificate.push(this.certificate.replace(/\s+/g, ''));
        } else if (this.certificateChkbx === false) {

            var index = company.certificate.indexOf(this.certificate.replace(/\s+/g, ''));
            company.certificate.splice(index, 1);
        }

        if (company.certificate.length === 0 && company.state.length === 0) {
            getCompany("/companies/");
        } else {
            getCompany("/companyFilters/" + JSON.stringify(company));
        }
    };
    $scope.clearAllStates = function () {
        company.state = [];
        $('input[ng-model="stateChkbx"]').attr('checked', false);

        if (company.certificate.length === 0 && company.state.length === 0) {
            getCompany("/companies/");
        } else {
            getCompany("/companyFilters/" + JSON.stringify(company));
        }
    };
    $scope.clearAllCertificates = function () {
        company.certificate = [];
        $('input[ng-model="certificateChkbx"]').attr('checked', false);

        if (company.certificate.length === 0 && company.state.length === 0) {
            getCompany("/companies/");
        } else {
            getCompany("/companyFilters/" + JSON.stringify(company));
        }
    };
    }])
});