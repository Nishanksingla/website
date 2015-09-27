require.config({
    baseUrl: "",
    paths: {
        'newApp': 'newApp',
        'angular': 'js/angular.min',
        'angular-route': 'js/angular-route.min',
        'angularAMD': 'js/angularAMD.min',
        'ngProgress': 'js/ngProgress',
        'ng-file-upload':'js/ng-file-upload.min'
    },
    shim: {       
        'angularAMD': ['angular'],
        'angular-route': ['angular'],
        'ngProgress': ['angular']
    },
    deps: ['app']
    
});
