/**
 * Created by admin on 14-Dec-16.
 */

var app = angular.module("Home", ['ui.bootstrap',
    'appServices',
    'app',
    'angularTypewrite',
    'ngBootbox',
    'ngStorage',
    'ismobile',
      'seo']);

app.config(['$locationProvider', '$routeProvider', 'isMobileProvider', function ($locationProvider, $routeProvider, isMobile) {
    if (isMobile.phone) {
        console.log("Mobile Device");
        window.location = "/mweb";
    }
    $locationProvider.html5Mode(true);
}]);

app.controller("Home", ["$http", "$rootScope", '$scope', '$window', "$location", "$anchorScroll", "$timeout", "$uibModal",
    function ($http, $rootScope, $scope, $window, $location, $anchorScroll, $timeout, $uibModal) {

        $scope.typing = 0;
        console.log('typing>', $scope.typing);
        setTimeout(function () {
            $scope.typing = 1;
            $scope.side_logo = 1;
            console.log('typing after>', $scope.typing);
        }, 2000);

        $scope.typing_Text = "Which among the following categories do you wanna shop for?";
        $scope.hideWave = function () {
            $scope.typing = 0;
            $scope.showTile = 1;
            console.log('typing>', $scope.typing);
             $scope.htmlReady();
        }

        app.directive("footerDiv", function () {
            return {
                restrict: 'EA',
                templateUrl: 'static/template/footer.html'
            };
        });
        $scope.myDialog = function () {
            console.log('done');
            $uibModal.open({
                templateUrl: 'static/template/popup.html',
                backdrop: 'static',
                windowClass: 'modal',
                size: 'lg',
                controller: function ($scope, $uibModalInstance) {
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss();
                    };
                }
            });
        };
    }]);

app.directive("footerDiv", function () {
    return {
        restrict: 'EA',
        templateUrl: 'static/template/footer.html'
    };
});

