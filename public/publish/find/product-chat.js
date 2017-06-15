/**
 * Created by admin on 14-Dec-16.
 */

var app = angular.module("Find",[]);

app.controller("Find",["$rootScope",'$scope','$window','socket',"$location", "$anchorScroll","$timeout", 
    function($rootScope,$scope,$window,socket, $location, $anchorScroll,$timeout){
       
      
    //  alert('resolved data>'+ JSON.stringify($rootScope.message));
    
 $scope.postMesg = function(message){
          console.log(message);
          $scope.message = message;
          $rootScope.message = message;
         $location.path('/find/aaa/'+message.replace(/ /g,"-"));
      
       }
  
}]);


app.factory('userService', ['$rootScope', function ($rootScope) {

    var service = {

        model: {
            name: 'saimahesh',
            email: '@gmail.com',
            user : $rootScope.query
        },

        SaveState: function () {
            sessionStorage.userService = angular.toJson(service.model);
        },

        RestoreState: function () {
            service.model = angular.fromJson(sessionStorage.userService);
        }
    }

    $rootScope.$on("savestate", service.SaveState);
    $rootScope.$on("restorestate", service.RestoreState);

    return service;
}]);