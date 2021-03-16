angular.module('app.api', [])
    .service('APIService', ['$http', function ($http) {
        this.baseUrl = ''

        this.get = function (params) {
            var url = this.baseUrl  + params.join('/');
            var $promise = $http({
                method: 'GET',
                url: url
            })
            return $promise.then(function (response) {
                    return response.data
                },
                function (err) {
                    return err
                })
        }


    }])
