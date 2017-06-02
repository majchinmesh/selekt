'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'app',
    'ngRoute',
    'Search',
    'WeddingDressesForWomen',
    'Home',
    'appServices',
    'angularTypewrite',
    'Find',
    'ngBootbox',
    'ngStorage',
    'ismobile'
]).config(['$locationProvider', '$routeProvider', 'isMobileProvider',function ($locationProvider, $routeProvider, isMobile) {

    var title = undefined;
    if(isMobile.phone) {
     $routeProvider
        .when("/",{
            title:'Selekt',
            templateUrl:"index_mobile.html"
        })
        .otherwise(
        {
            title:'Selekt',
            templateUrl:"index_mobile.html"
        });
   }
   else{
    $routeProvider

        .when("/", {
            title: 'Selekt',
            templateUrl: "publish/home/product-chat.html",
            controller: "Home"

        })
        .when("/women", {
            title: 'Women',
            templateUrl: "publish/search/product-chat.html",
            controller: "Search"

        })
        .when("/find", {
            title: 'Find',
            templateUrl: "publish/find/product-chat.html",
            controller: "Find"

        })
        .when('/find/:search', {
            title: 'find',
            templateUrl: "publish/wedding-dresses-for-women/product-chat.html",
            controller: "WeddingDressesForWomen",
            resolve: {
                title: function ($route, $timeout) {
                    var query = $route.current.params.search;
                    var resolvedData = {};
                    resolvedData.title = query;
                    var url = "http://52.74.62.47";
                    //alert('url>'+url);
                    var socket = io.connect(url, {"path": "/selekt_website"});
                    var pre_chat = '{"message" :"' + query.replace(/-/g, " ") + '", "session_id" :"3483834834834","device_id"  :  "msdnlkafdnoacsndoahesh","user_name"  :"User"}';
                    console.log(query);
                    socket.emit('question', pre_chat);

                    socket.on('chat', function (data) {
                        resolvedData.title = data.question;
                        console.log(data);
                        return data;
                    });
                    console.log(resolvedData);
                    return resolvedData;

                }
            }

        });
    }
    $locationProvider.html5Mode(true);

//
}]).value('appSettings', {title2: 'selekt2'})
.run(['$location', '$rootScope', 'appSettings','$route','$localStorage', function ($location, $rootScope, appSettings,$route,$localStorage) {
    $rootScope.title2 = 'title2';
    $rootScope.socketUrl = 'http://52.74.62.47'
    $rootScope.absUrls = $location.absUrl();
    $rootScope.paths   = $location.path();
    if($rootScope.paths != '/')
    $rootScope.website = $rootScope.absUrls.replace($rootScope.paths,"");
    else
    $rootScope.website = $rootScope.absUrls.substring(0, $rootScope.absUrls.length-1)+"";
    // console.log('cur_absUrl>'+ $rootScope.absUrls);
    // console.log('cur_pathUrl>'+ $rootScope.paths);
    // console.log('website>'+ $rootScope.website);

     $rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.actualLocation = $location.path();
    });   
    $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
        if($rootScope.actualLocation === newLocation) {
            // alert('Why did you use history back?');
            $rootScope.restorestate = 1;
            $localStorage.restorestate = 1;
            
        }
        else
        {
         $rootScope.restorestate = 0;
            $localStorage.restorestate = 0;
        }
        //  console.log('restore>'+ $localStorage.restorestate);
    });

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (sessionStorage.restorestate == "true") {
            $rootScope.$broadcast('restorestate'); //let everything know we need to restore state
            sessionStorage.restorestate = false;
        }
    });

//let everthing know that we need to save state now.
    window.onbeforeunload = function (event) {
        $rootScope.$broadcast('savestate');
    };
}]);
``