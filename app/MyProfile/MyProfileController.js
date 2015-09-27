"use strict";

define(['app', 'ng-file-upload'], function (app) {
    app.register.controller('MyProfileController', ['$scope', '$http', 'Upload', function ($scope, $http, Upload) {
        
        $scope.states = ['Select a State', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        $scope.certificatesList = ["BRC", "SQFLevel1", "SQFLevel2", "SQFLevel3", "AIB", "GMP", "USDA", "ISO", "IFS", "ISO22000 FSSC", "kosher"];
        $scope.ProductData = {};

        $scope.ProductCategories = $scope.$parent.$parent.categories;
        $scope.PackagingTypes = $scope.$parent.$parent.PackagingTypes;

        $scope.Sizes = ["1 to 8 Oz", "9 to 16 Oz", "17 to 32 Oz", "33 to 127 Oz", "1 to 5 gal", "More than 5 gal"];

        $scope.Features = ['Kosher', 'Organic', 'Vegan', 'Low Sodium', 'Sugar-Free', 'Halal', 'Natural', 'Non-GMO', 'Vegetarian', 'Non-Fat', 'Low-Fat', 'Gluten-Free'];

        $scope.ProductData.SelectedFeatures = [];

        $scope.ProductImage;

        $scope.addCertificate=[];

        $http.get('/MyCompanyData').
           success(function (data, status, headers, config) {
               debugger
               if (data.status === 'logout') {
                   window.location.assign('index.html');
               }
               $scope.companyData = data.company;

               $scope.indexes = ($scope.companyData.Certificates).map(function (obj, index) {
                   if (obj.name == "kosher") {
                       return index;
                   }
               }).filter(isFinite)

               if ($scope.indexes.length!==0) {
                 $scope.kosherCert = $scope.companyData.Certificates[$scope.indexes[0]];
                 $scope.companyData.Certificates.splice($scope.indexes[0], 1);
               };

               angular.forEach($scope.companyData.Certificates,function(certificate,key){
                  debugger
                  var index=$scope.certificatesList.indexOf(certificate.name);
                  if (index>-1) {
                    $scope.certificatesList.splice(index,1);
                  };
                  debugger
               });

               if (data.products) {
                   $scope.products = data.products;
               }

               $scope.Documents = [];
               if ($scope.companyData.otherdocs) {
                   angular.forEach($scope.companyData.otherdocs, function (docs, key) {
                       var obj = {};
                       obj.location = docs;
                       obj.name = docs.split('/').pop();
                       $scope.Documents.push(obj);
                   })
               }
           }).
           error(function (data, status, headers, config) {
           });

        $scope.SelectFeature = function () {
            if (this.FeatureModel) {
                $scope.ProductData.SelectedFeatures.push($scope.Features[this.$index]);
            } else {
                var index = $scope.ProductData.SelectedFeatures.indexOf($scope.Features[this.$index]);
                $scope.ProductData.SelectedFeatures.splice(index, 1);
            }
        }

        $scope.SelectCert=function(){
          debugger
          var certObj={};
          certObj.name=this.certificate;
          certObj.path="";
          $scope.addCertificate.push(certObj);
          debugger
        }

        $scope.AddCertSubmit=function(){
          $http.post('/addCertificate', $scope.addCertificate)
                   .success(function (data) {
                       if (data.status === 'Success') {
                           location.reload();
                       } else {
                           alert("ERROR Updating Company Info. Please try again... ");
                           return false;
                       }
                   })
                   .error(function (data, status, headers, config) {
                       alert("ERROR connecting to server. Please check your internet connection... ");
                   });

        }

        $scope.UpdateCompanyInfo = function () {
            $http.post('/updateCompanyInfo', $scope.companyData)
                   .success(function (data) {
                       if (data.status === 'Success') {
                           location.reload();
                       } else {
                           alert("ERROR Updating Company Info. Please try again... ");
                           return false;
                       }
                   })
                   .error(function (data, status, headers, config) {
                       alert("ERROR connecting to server. Please check your internet connection... ");
                   });
        }

        $scope.UpdateContactInfo = function () {
            $http.post('/updateContactInfo', $scope.companyData)
                   .success(function (data) {
                       if (data.status === 'Success') {
                           location.reload();
                       } else {
                           alert("ERROR Updating Company Info. Please try again... ");
                           return false;
                       }
                   })
                   .error(function (data, status, headers, config) {
                       alert("ERROR connecting to server. Please check your internet connection... ");
                   });
        }

        $scope.deleteCert=function(){
          debugger
          if (this.certificate) {
            $scope.CertToDelete=this.certificate;
          }else if (this.kosherCert) {
            $scope.CertToDelete=this.kosherCert;
            if (this.companyData.CertiBody) {
              $scope.CertToDelete.CertifyingBody=this.companyData.CertiBody;
              debugger
            }            
          }else if (this.document) {
            $scope.CertToDelete={};
            $scope.CertToDelete.DocType='otherdocs';
            $scope.CertToDelete.name=this.document.name;
            $scope.CertToDelete.path=this.document.location;
          };
        }

        $scope.DeleteModelSubmit=function(){
          debugger
          $http.post("/deleteCert", $scope.CertToDelete)
                   .success(function (data) {
                    debugger
                       if (data.status === 'Success') {
                           location.reload();
                       } else {
                           alert("ERROR Updating Company Info. Please try again... ");
                           return false;
                       }
                   })
                   .error(function (data, status, headers, config) {
                       alert("ERROR connecting to server. Please check your internet connection... ");
                   });

        }

        $scope.AddProduct = function () {
            console.log('$scope.ProductData.SelectedFeatures');
            console.log(typeof ($scope.ProductData.SelectedFeatures));
            Upload.upload({
                url: '/addproduct',
                fields: $scope.ProductData,
                file: $scope.ProductImage
            }).success(function (data, status, headers, config) {
                if (data.message === 'Exists') {
                    alert('Product already exists');
                    return;
                }
                if (data.message === 'image exists') {
                    alert('Image with this name already exists')
                    return;
                }
                if (data.message === 'success') {
                    location.reload();
                }
                if (data.code === "ENOENT") {
                    alert('Unable to save the product')
                    return;
                }

            }).error(function (data, status, headers, config) {
                console.log('error status: ' + status);
            })
        }


    }]);
});
