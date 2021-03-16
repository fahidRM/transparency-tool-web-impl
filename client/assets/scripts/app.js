angular.module('phd_study_one',[
    'ngRoute',
    'app.api',
    'app.debugger'
])
    .config(['$locationProvider', '$routeProvider', '$httpProvider',
        function ($locationProvider, $routeProvider, $httpProvider) {
            $locationProvider.hashPrefix('!')
            $routeProvider.otherwise({redirectTo: '/'});
        }])

