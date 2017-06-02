/**
 * Created by admin on 14-Dec-16.
 */

var app = angular.module("Home",['ui.bootstrap']);

app.controller("Home",["$http","$rootScope",'$scope','appService','$window','socket',"$location", "$anchorScroll","$timeout","$uibModal",
    function($http,$rootScope,$scope,appService,$window,socket, $location, $anchorScroll,$timeout,$uibModal){
      
       $window.document.title = "Online shopping site | Women fashion | Personal styling - Selekt";
       $scope.typing=0;
       console.log('typing>',$scope.typing);
      setTimeout(function(){$scope.typing=1;$scope.side_logo=1; console.log('typing after>',$scope.typing);}, 2000);
       
       $scope.typing_Text = "Which among the following categories do you wanna shop for?";
       $scope.hideWave = function(){
         $scope.typing=0;
         $scope.showTile = 1;
         console.log('typing>',$scope.typing);
       }
  
   $scope.$on('$viewContentLoaded', function() {
    $scope.loaded=1;
    console.log('loaded');
});
   app.directive("footerDiv", function () {
    return {
        restrict: 'EA',
        templateUrl: 'template/footer.html'
    };
});
     $scope.myDialog = function () {
         console.log('done')
    $uibModal.open({
       templateUrl: 'template/popup.html',
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

