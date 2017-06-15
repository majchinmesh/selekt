"use strict";

/**
 * Created by admin on 14-Dec-16.
 */

var app = angular.module("ProductPage", ['ui.bootstrap', 'app', 'ngRoute', 'appServices', 'ngBootbox', 'ngStorage', 'ismobile', 'seo']).config(['$httpProvider', function ($httpProvider) {
            // enable http caching
           $httpProvider.defaults.cache = true;
      }]);

app.config(['$locationProvider', '$routeProvider', 'isMobileProvider', function ($locationProvider, $routeProvider, isMobile) {

    if (isMobile.phone) {
        console.log("Mobile Device");
        window.location = "/mweb";
    }
    $locationProvider.html5Mode(true);
}]);


app.factory('BlogPost', ['$resource',
    function($resource) {
        return $resource("./Post/:id", {}, {
            get:    {method: 'GET',    cache: true,  isArray: false},
            save:   {method: 'POST',   cache: false, isArray: false},
            update: {method: 'PUT',    cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);
app.run(['$location', '$rootScope', '$route', '$localStorage', function ($location, $rootScope, $route, $localStorage) {

    $rootScope.title2 = 'title2';
    $rootScope.socketUrl = 'https://www.prodx.in';
//    $rootScope.socketUrl = 'https://www.selekt.in';
    $rootScope.absUrls = $location.absUrl();
    $rootScope.paths = $location.path();
    if ($rootScope.paths != '/') $rootScope.website = $rootScope.absUrls.replace($rootScope.paths, "");else $rootScope.website = $rootScope.absUrls.substring(0, $rootScope.absUrls.length - 1) + "";
    // console.log('cur_absUrl>'+ $rootScope.absUrls);
    // console.log('cur_pathUrl>'+ $rootScope.paths);
    // console.log('website>'+ $rootScope.website);
    $rootScope.$on('$locationChangeSuccess', function () {
        $rootScope.actualLocation = $location.path();
    });
    $rootScope.$watch(function () {
        return $location.path();
    }, function (newLocation, oldLocation) {
        if ($rootScope.actualLocation === newLocation) {
            // alert('Why did you use history back?');
            $rootScope.restorestate = 1;
            $localStorage.restorestate = 1;
        } else {
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

app.controller("ProductPage",
 ["$http", "$rootScope", '$scope', '$window', 'socket', "$location", "$anchorScroll", "$timeout", '$routeParams', 'userService', '$filter', '$document', '$localStorage', '$uibModal', 
 function ($http, $rootScope, $scope, $window, socket, $location, $anchorScroll, $timeout, $routeParams, userService, $filter, $document, $localStorage, $uibModal)
  {
 

      console.log("localStorage now is ",$localStorage);
      console.log("current scroll y ",$window.scrollY);
      console.log("current scroll x ",$window.scrollX);
      //$window.scrollTo(0, 0);

      $scope.id = $rootScope.absUrls.split('/')[5] 
      $scope.product_line = $rootScope.absUrls.split('/')[4] ; 

      //$localStorage['search'] = $scope.product_line ;
      //console.log("and localStorage now is ",$localStorage);


      $scope.show_page = true ;
      $scope.shop_by_brands_dir = false ;
      $scope.ref = false ;
      $scope.inspirations_dir = true ;
      $scope.product_list_content_dir = false ;
      $scope.product_page_content_dir = true ;

      /*
      window.onbeforeunload = function() {
        $localStorage['pressed_back_from_product_page'] = true ;
        //Do your stuff here
      }
      */

      /*
      console.log("localStorage.product_list");
      console.log($localStorage.product_list);
      */

      /*trying to fetch the product data from the localStorage */ 
      try {
          var product_id = "selekt_" + $scope.id  ;
          var retrievedObject = localStorage.getItem(product_id) ;
          var x = JSON.parse(retrievedObject) ;
          $window.document.title = x.product_filter.display_name + ' | ' + $scope.product_line + ' | selekt.in'; /*.toUpperCase();*/
          $rootScope.product_page = x;
          $rootScope.product_page['image'] = x.style_image.search.imageURL;


      }
      catch(err) {
          console.log("This link was directly visited so the data is missing.");
          console.log("Trying to fetch data from backend.");
          $scope.suggestion_timer = setTimeout(function () {
                $http({
                    url: 'https://www.prodx.in/selekt/'+$scope.product_line+'/'+$scope.id,
                    method: "GET",
                    data: {}
                })
                    .then(function (retrievedObject) {
                            var product_data = retrievedObject.data ;
                            console.log("product_data",product_data);     
                            $window.document.title = product_data.product_filter.display_name + ' | ' + $scope.product_line + ' | selekt.in'; /*.toUpperCase(); */
                            $rootScope.product_page = product_data;
                            $rootScope.product_page['image'] = product_data.style_image.search.imageURL;
                        },
                        function (response) {

                        });
            }, 200);



          console.log("received the data.");
      }
      



      // create the timer variable
        var timer;

// mouseenter event
        $scope.showIt = function (tag) {
            timer = $timeout(function () {
                console.log('======');
                $scope.prev_hovering = $scope.current_hover;
                $scope.hovering = true;
                $scope.current_hover = tag;

                console.log('in showit>' + $scope.hovering);
            }, 300);
        };
        $scope.showIt2 = function (tag) {
            console.log('======');
            $scope.prev_hovering = $scope.current_hover;
            $scope.hovering = true;
            $scope.current_hover = tag;
            console.log('in showit2>' + $scope.hovering);
        };

// mouseleave event
        $scope.hideIt = function () {
            $timeout(function () {
                $timeout.cancel(timer);
                console.log('======');
                console.log('current_hover>' + $scope.current_hover);
                if ($scope.current_hover == 'button' && ($scope.prev_hovering != 'button')) {
                    $scope.hovering = false;
                }
                console.log('in hide>' + $scope.hovering);
            }, 100);

        };      

        // the mouse over change function
        $rootScope.changeImage = function (image) {
            $rootScope.product_page['image'] = image;
        };


        $scope.gototop = function () {
            $("html, body").animate({scrollTop: 0}, 1000);
        };

        /*
        $scope.getProductDetails = function(product_line,id){

          $scope.suggestion_timer = setTimeout(function () {
                $http({
                    url: 'http://52.74.62.47/selekt/'+product_line+'/'+id,
                    method: "GET",
                    data: {}
                })
                    .then(function (retrievedObject) {
                            var x = JSON.parse(retrievedObject) ;
                            $rootScope.product_page = x;
                            $rootScope.product_page['image'] = x.style_image.search.imageURL;
                        },
                        function (response) {

                        });
            }, 200);
        };
         not used */






















  
  }
]
);

//Custom Filter
app.filter('removeunderscore', function () {
    return function (input) {
        if (input) return input.replace(/_/g, ' ');
    };
});
app.filter('capitalize', function () {
    return function (input) {
        if (input) {
            input = input.trim();
            return !!input ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    };
});
app.filter('underscoreless', function () {
    return function (input) {
        if (input) return input.replace(/_/g, '-');
    };
});
app.filter('custtrim', function () {
    return function (input) {
        if (input != undefined) return input.trim();
    };
});
app.filter('replacespace', function () {
    return function (input) {
        if (input) return input.replace(/ /g, '-');
    };
});
app.filter('addfor', function () {
    return function (input) {

        if (input != '') return input + '-for';
    };
});
app.filter('removehiphen', function () {
    return function (input) {
        if (input) return input.replace(/-/g, ' ');
    };
});
app.filter('removestarthiphen', function () {
    return function (input) {
        if (input.charAt(0) == '-') input = input.charAt(0).replace(/-/g, ' ') + input.substr(1);
        return input;
    };
});

/* Services */
app.factory('socket', function ($rootScope) {
    var url = "https://www.prodx.in";
//    var url = "https://www.selekt.in"
    // console.log('in factory');
    var socket = io.connect(url, {
        "path": "/selekt_website"
    });
    return {
        on: function on(eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function emit(eventName, data, callback) {
            // console.log('data >>', data);
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});
//Directive to make Chat Template SCROLL after certain height
app.directive("scroll", function ($window) {
    return function (scope, element, attrs) {
        angular.element($window).bind("scroll", function () {
            var total_page_height = angular.element(document.getElementById('main_page')).prop('offsetHeight');
            var $gototop = angular.element(document.querySelector('#gotoTop'));

            if (this.pageYOffset > 200) $gototop.css('visibility', 'visible');else $gototop.css('visibility', 'hidden');

            var div_height = element[0].offsetHeight;
            if (div_height < 500) div_height = 1780;
            var catHeight = scope.category_page_height;
            if (this.pageYOffset >= div_height - (catHeight + 1000)) {
                scope.set_top = div_height - (catHeight + 1000);
                scope.boolChangeClass = 1;
                console.log("Bool Change Class: ", $scope.boolChangeClass);
            } else {
                scope.boolChangeClass = 0;
                console.log("Bool Change Class: ", $scope.boolChangeClass);
            }
            var divsize = angular.element(document.getElementById('filter_Y')).prop('offsetHeight');
            //console.log('Width of fun_div: ' + divsize+ 'real hig>'+ this.pageYOffset+ 'total height>'+ total_page_height);
            var myh1 = this.pageYOffset;
            if (myh1 < divsize - 450 && myh1 > 100) {
                scope.filter_height = 200 + myh1 * -1;
                scope.last_filter_height = scope.filter_height;
                scope.last_filter_height2 = scope.filter_height;
                console.log('in 1');
            }

            if (myh1 > divsize - 450 && myh1 < total_page_height - 1000) {
                scope.filter_height = scope.last_filter_height;

                scope.last_filter_height2 = scope.filter_height;
                //console.log('in 2');
            }

            if (myh1 < 100) {
                scope.filter_height = 100;
                console.log('in 3');
            }
            var a = this.pageYOffset;
            if (this.pageYOffset >= total_page_height - 1000) {

                scope.filter_height = scope.last_filter_height2 -= 5;
                //console.log('in 4');
            }

            //console.log('filter_height>',scope.filter_height);
            scope.$apply();
        });
    };
});
//Helper directive for above scroll directive
app.directive("scroll2", function ($window) {
    return function (scope, element) {
        angular.element($window).bind("scroll", function () {
            scope.category_page_height = element[0].offsetHeight;
            scope.$apply();
        });
    };
});
app.factory('userService', ['$rootScope', function ($rootScope) {
    var service = {
        model: {
            name: 'saimahesh',
            email: '@gmail.com',
            user: $rootScope.query
        },
        SaveState: function SaveState() {
            sessionStorage.userService = angular.toJson(service.model);
        },
        RestoreState: function RestoreState() {
            service.model = angular.fromJson(sessionStorage.userService);
        }
    };
    $rootScope.$on("savestate", service.SaveState);
    $rootScope.$on("restorestate", service.RestoreState);
    return service;
}]);
app.directive("chatFilter", function () {
    return {
        restrict: 'EA',
        templateUrl: 'static/template/chat_filter.html'
    };
});
app.directive("chatBenefits", function () {
    return {
        restrict: 'EA',
        templateUrl: 'static/template/chat_benefit.html'
    };
});
app.directive("chatBot", function () {
    return {
        restrict: 'EA',
        templateUrl: 'static/template/chat_bot.html'
    };
});
app.directive("navHeader", function () {
    return {
        restrict: 'EA',
        templateUrl: 'static/template/nav_header.html'
    };
});
app.directive("productListContent", function () {
    return {
        restrict: 'EA',
        templateUrl: 'static/template/product_list_content.html'
    };
});
app.directive("inspirations", function () {
    return {
        restrict: 'EA',
        templateUrl: 'static/template/inspirations.html'
    };
});
app.directive("categoryPage", function () {
    return {
        restrict: 'EA',
        templateUrl: 'static/template/category_page.html'
    };
});

app.directive("productPageContent",function(){
    return {
        restrict: 'EA',
        templateUrl: 'static/template/product_page.html'
    };
});

app.directive("footerDiv", function () {
    return {
        restrict: 'EA',
        templateUrl: 'static/template/footer.html'
    };
});
app.directive("shopByBrands", function () {
    return {
        restrict: 'EA',
        templateUrl: 'static/template/shop_by_brands.html'
    };
});
app.directive('fancybox', function ($compile, $http) {
    return {
        restrict: 'A',

        controller: function controller($scope) {
            $scope.openFancybox = function (url) {

                $http.get(url).then(function (response) {
                    if (response.status == 200) {

                        var template = angular.element(response.data);
                        var compiledTemplate = $compile(template);
                        compiledTemplate($scope);

                        $.fancybox.open({ content: 'static/' + template, type: 'html' });
                    }
                });
            };
        }
    };
});