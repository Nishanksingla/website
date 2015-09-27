angular.module('mainApp', ['ui.utils', 'angularFileUpload', 'ngProgress'])
.config(function (ngProgressProvider) {
    // Default color is firebrick
    ngProgressProvider.setColor('firebrick');
    // Default height is 2px
    ngProgressProvider.setHeight('2px');
})
.factory('CommonCode', ['$http', function ($http) {
    return {
        login: function (loginInfo) {
            $http.post('/login', loginInfo)
            .success(function (data) {
                if (data.err) {
                    alert('Error getting data. Please try again..'); return;
                }
                if (data.message === "Wrong password") {
                    $('.error').html('<h5 style="color:red;margin:0">*Password is wrong..Please try again</h5>');
                }
                if (data.message === "NotExists") {
                    $('.error').html('<h5 style="color:red;margin:0">*Username does not exists</h5>');
                }
                if (data.message === "Exists") {
                    window.location.reload();
                }
            })
            .error(function (data, status, headers, config) {
            });
        },
        logout: function () {
            $http.get('/logout').
            success(function (data, status, headers, config) {
                window.location.assign('index.html');
            }).
            error(function (data, status, headers, config) {

            });
        },
        forgotPassword: function (forgetPassdata) {
            $http.post("/forgotPassword", forgetPassdata)
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
        },
        states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
    }
}])
.filter('searchState', function () {
    return function (items, search) {
        var filtered = [];
        if (!search) {
            return items;
        }
        angular.forEach(items, function (item) {
            if (angular.lowercase(item).indexOf(angular.lowercase(search)) !== -1) {
                filtered.push(item);
            }
        })
        return filtered;
    };
})
.controller('indexCntrler', ['$scope', '$http', 'CommonCode', function ($scope, $http, CommonCode) {
    $scope.loginformData = {};
    $scope.frgtPassformData = {};

    $http.get('/getLoginStatus').
    success(function (data, status, headers, config) {

        $scope.loginStatus = data.status;
        if (data.userData) {
            $scope.userData = data.userData;
        }
    }).
    error(function (data, status, headers, config) {

    });
    $scope.loginformSubmit = function () {
        CommonCode.login($scope.loginformData);
    }

    $scope.frgtPassformSubmit = function () {
        CommonCode.forgotPassword($scope.frgtPassformData);
    }
    $scope.logout = function () {
        CommonCode.logout();
    }
}])

.controller('AboutUsCntrler', ['$scope', '$http', 'CommonCode', function ($scope, $http, CommonCode) {
    $scope.loginformData = {};
    $scope.frgtPassformData = {};

    $http.get('/getLoginStatus').
    success(function (data, status, headers, config) {

        $scope.loginStatus = data.status;
        if (data.userData) {
            $scope.userData = data.userData;
        }
    }).
    error(function (data, status, headers, config) {

    });
    $scope.loginformSubmit = function () {
        CommonCode.login($scope.loginformData);
    }

    $scope.frgtPassformSubmit = function () {
        CommonCode.forgotPassword($scope.frgtPassformData);
    }
    $scope.logout = function () {
        CommonCode.logout();
    }
}])

.controller('ContactUsCntrler', ['$scope', '$http', 'CommonCode', function ($scope, $http, CommonCode) {
    $scope.loginformData = {};
    $scope.frgtPassformData = {};

    $http.get('/getLoginStatus').
    success(function (data, status, headers, config) {

        $scope.loginStatus = data.status;
        if (data.userData) {
            $scope.userData = data.userData;
        }
    }).
    error(function (data, status, headers, config) {

    });
    $scope.loginformSubmit = function () {
        CommonCode.login($scope.loginformData);
    }

    $scope.frgtPassformSubmit = function () {
        CommonCode.forgotPassword($scope.frgtPassformData);
    }
    $scope.logout = function () {
        CommonCode.logout();
    }
}])

.controller('RegistrationCntrler', ['$scope', '$http', 'CommonCode', function ($scope, $http, CommonCode) {
    $scope.loginformData = {};
    $scope.frgtPassformData = {};

    $http.get('/getLoginStatus').
    success(function (data, status, headers, config) {

        $scope.loginStatus = data.status;
        if (data.userData) {
            $scope.userData = data.userData;
        }
    }).
    error(function (data, status, headers, config) {

    });
    $scope.loginformSubmit = function () {
        CommonCode.login($scope.loginformData);
    }

    $scope.frgtPassformSubmit = function () {
        CommonCode.forgotPassword($scope.frgtPassformData);
    }
    $scope.logout = function () {
        CommonCode.logout();
    }
}])

.controller('404Cntrler', ['$scope', '$http', 'CommonCode', function ($scope, $http, CommonCode) {
    $scope.loginformData = {};
    $scope.frgtPassformData = {};

    $http.get('/getLoginStatus').
    success(function (data, status, headers, config) {

        $scope.loginStatus = data.status;
        if (data.userData) {
            $scope.userData = data.userData;
        }
    }).
    error(function (data, status, headers, config) {

    });
    $scope.loginformSubmit = function () {
        CommonCode.login($scope.loginformData);
    }

    $scope.frgtPassformSubmit = function () {
        CommonCode.forgotPassword($scope.frgtPassformData);
    }
    $scope.logout = function () {
        CommonCode.logout();
    }
}])

.controller('productsCntrler', ['$scope', '$http', '$upload', 'CommonCode', 'ngProgress', function ($scope, $http, $upload, CommonCode, ngProgress) {
    $scope.hide_show = [];
    $scope.loginformData = {};
    $scope.frgtPassformData = {};
    $scope.hideProgressbar = true;
    $scope.uploadProgress = 0;
    $scope.sizesList = ["1 to 8 Oz", "9 to 16 Oz", "17 to 32 Oz", "33 to 127 Oz", "1 to 5 gal", "More than 5 gal"];
    var query = { category: {}, size: [], packagingType: [] };
    $http.get('/product').
    success(function (data, status, headers, config) {

        $scope.products = data.products;
        $scope.productCount = data.products.length;
        $scope.productFilter = data.filters[0].productlist;
        $scope.packagingFilter = data.filters[0].packagingType;

        $scope.loginStatus = data.status;

        if (data.userData) {
            $scope.userData = data.userData;
        }
        //ngProgress.complete();
    }).
    error(function (data, status, headers, config) {

    });

    $scope.loginformSubmit = function () {
        CommonCode.login($scope.loginformData);
    }

    $scope.frgtPassformSubmit = function () {
        CommonCode.forgotPassword($scope.frgtPassformData);
    }
    $scope.logout = function () {
        CommonCode.logout();
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

    var getProductData = function () {
        ngProgress.start();
        $http.get('/product/' + JSON.stringify(query)).
        success(function (products, status, headers, config) {
            $scope.products = products;
            $scope.productCount = products.length;
            ngProgress.complete();
        }).
        error(function (data, status, headers, config) {

        });
    }


}])

.controller('companiesCntrler', ['$scope', '$http', 'CommonCode', function ($scope, $http, CommonCode) {
    $scope.loginformData = {};
    $scope.frgtPassformData = {};
    var company = {
        certificate: [],
        state: []
    };
    $scope.states = CommonCode.states;
    $scope.certificates = ["BRC", "SQF Level 1", "SQF Level 2", "SQF Level 3", "AIB", "GMP", "USDA", "ISO", "IFS", "ISO22000 FSSC", "kosher"];

    var getCompany = function (url) {
        $http.get(url).
        success(function (data, status, headers, config) {
            $scope.companies = data.companies;
            $scope.companyCount = data.companies.length;
            $scope.loginStatus = data.status;
            if (data.userData) {
                $scope.userData = data.userData;
            }
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
    }

    $scope.clearAllStates = function () {
        company.state = [];
        $('input[ng-model="stateChkbx"]').attr('checked', false);

        if (company.certificate.length === 0 && company.state.length === 0) {
            getCompany("/companies/");
        } else {
            getCompany("/companyFilters/" + JSON.stringify(company));
        }
    }
    $scope.clearAllCertificates = function () {
        company.certificate = [];
        $('input[ng-model="certificateChkbx"]').attr('checked', false);

        if (company.certificate.length === 0 && company.state.length === 0) {
            getCompany("/companies/");
        } else {
            getCompany("/companyFilters/" + JSON.stringify(company));
        }
    }

    $scope.loginformSubmit = function () {
        CommonCode.login($scope.loginformData);
    }

    $scope.frgtPassformSubmit = function () {
        CommonCode.forgotPassword($scope.frgtPassformData);
    }
    $scope.logout = function () {
        CommonCode.logout();
    }
}])

.controller('companyProfileCntrler', ['$scope', '$http', 'CommonCode', function ($scope, $http, CommonCode) {
    $scope.loginformData = {};
    $scope.frgtPassformData = {};
    $http.get("/Companies/" + window.location.href.split('=')[1]).
    success(function (data, status, headers, config) {
        $scope.company = data.company;
        $scope.Products = data.products;
        $scope.loginStatus = data.status;
        if (data.userData) {
            $scope.userData = data.userData;
        }
    }).
    error(function (data, status, headers, config) {

    });
    $scope.selectProduct = function () {
        $scope.categoryProduct = [];
        var selectedCategory = this.product.category;
        angular.forEach($scope.Products, function (product, key) {
            if (product.category === selectedCategory) {
                $scope.categoryProduct.push(product);
            }
        });

    }
    $scope.loginformSubmit = function () {
        CommonCode.login($scope.loginformData);
    }

    $scope.frgtPassformSubmit = function () {
        CommonCode.forgotPassword($scope.frgtPassformData);
    }
    $scope.logout = function () {
        CommonCode.logout();
    }
}])

.controller('userProfileCntrler', ['$scope', '$http', 'CommonCode', function ($scope, $http, CommonCode) {
    $scope.loginformData = {};
    $scope.frgtPassformData = {};
    $scope.states = CommonCode.states;
    $http.get('/MyCompanyData').
    success(function (data, status, headers, config) {
        if (data.status === 'logout') {
            window.location.assign('index.html');
        }
        $scope.companyData = data.company;
        $scope.indexes = ($scope.companyData.Certificates).map(function (obj, index) {
            if (obj.name == "kosher") {
                return index;
            }
        }).filter(isFinite)
        $scope.kosherCert = $scope.companyData.Certificates[$scope.indexes[0]];
        $scope.companyData.Certificates.splice($scope.indexes[0], 1);

        $scope.filters = data.filters;
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

    $scope.loginformSubmit = function () {
        CommonCode.login($scope.loginformData);
    }

    $scope.frgtPassformSubmit = function () {
        CommonCode.forgotPassword($scope.frgtPassformData);
    }
    $scope.logout = function () {
        CommonCode.logout();
    }
}])

.controller('uploadCntrler', ['$scope', '$http', '$upload', 'CommonCode', function ($scope, $http, $upload, CommonCode) {
    $scope.hideProgressbar = false;
    $scope.errorMessage = "";

    $scope.model = {};
    $scope.selectedFile = [];
    $scope.uploadProgress = 0;

    $scope.uploadFile = function () {
        var file = $scope.selectedFile[0];
        $scope.upload = $upload.upload({
            url: '/testUpload',
            method: 'POST',
            data: $scope.model,
            file: file
        }).progress(function (evt) {

            $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total, 10);
        }).success(function (data) {
            //do something
            $scope.hideProgressbar = true;
        });
    };

    $scope.onFileSelect = function (files) {
        debugger
        $scope.uploadProgress = 0;
        $scope.hideProgressbar = false;
        if (files[0].type.split('/').pop().toLowerCase() !== 'pdf') {
            $scope.errorMessage = '*Please upload a PDF file';
            $scope.$apply();
        } else
            if (files[0].size / 1024 > 400) {
                $scope.errorMessage = '*Please upload file of size less than 400kb';
                $scope.$apply();
            } else {
                $scope.errorMessage = "";
                $scope.selectedFile = files;
            }

    };





    //$('#uploadfile').bind("change", function(e) {   
    //    var files = e.target.files;
    //    debugger
    //    if (files[0].type.split('/').pop().toLowerCase() !== 'pdf') {
    //        $scope.errorMessage = '*Please upload a PDF file';
    //        $scope.$apply();
    //    }else 
    //    if (files[0].size / 1024 > 400) {
    //        $scope.errorMessage = '*Please upload file of size less than 400kb';
    //        $scope.$apply();
    //    } else {
    //        $scope.errorMessage = "";
    //    uiUploader.addFiles(files);
    //    $scope.files = uiUploader.getFiles();
    //    $scope.$apply();
    //    }
    //});

    //$scope.btn_remove = function (file) {        
    //    console.log(file);
    //    debugger
    //    $scope.files= uiUploader.removeFile(file);
    //    $scope.$apply();
    //};
    //$scope.btn_upload = function () {
    //    if ($scope.files) {
    //        $scope.progressbarStatus = true;

    //    uiUploader.startUpload({
    //        url: '/testUpload',
    //        method:'POST',
    //        data: angular.toJson({'certName':'koksher','comName':'abcd'}),
    //        onProgress: function (file) {
    //            var value=(file.loaded / file.size) * 100;
    //            $scope.progressvalue = value.toFixed(2);
    //            console.log($scope.progressvalue);
    //            $scope.$apply();
    //        },
    //        onCompleted: function (file, response) {                
    //            //$scope.files = [];
    //            $scope.progressbar = true;
    //            $scope.$apply();
    //        }
    //    });        
    //    } else {
    //        alert('please select a file');
    //    }
    //};

}])


;
