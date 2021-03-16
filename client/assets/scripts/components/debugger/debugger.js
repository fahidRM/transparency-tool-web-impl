angular.module('app.debugger', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/assets/scripts/components/debugger/partials/index.html',
                controller: 'DebuggerCtrl',
                controllerAs: 'ctrl'
            })
    }])
