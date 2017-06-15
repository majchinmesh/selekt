"use strict";

/**
 * Created by admin on 14-june-17.
 */

var app = angular.module("WeddingDressesForWomen", ['ui.bootstrap', 'app', 'ngRoute', 'appServices', 'ngBootbox', 'ngStorage', 'ismobile', 'seo']).config(['$httpProvider', function ($httpProvider) {
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

app.controller("WeddingDressesForWomen", ["$http", "$rootScope", '$scope', '$window', 'socket', "$location", "$anchorScroll", "$timeout", '$routeParams', 'userService', '$filter', '$document', '$localStorage', '$uibModal', function ($http, $rootScope, $scope, $window, socket, $location, $anchorScroll, $timeout, $routeParams, userService, $filter, $document, $localStorage, $uibModal) {
    $scope.show_overlay = 0;
    $scope.ref = 0;
    $scope.show_page = 0;
    $routeParams.search = $location.absUrl().substr($location.absUrl().indexOf("find/") + 5).replace(/%20/g,"-");
    $scope.search = $routeParams.search;





    $scope.user_selected_categories = { occasion: '', age: '', body_shape: '', height: '', skin_color: '' };

    //Web structure variables
    $scope.web_structure_show_brands = 0;
    $scope.web_structure_show_factors = 1;
    $scope.show_foot = 0;

    //UA FORM VARIABLES
    $scope.show_ua = 0;
    $scope.show_ua_form = 0;
    $scope.ua_form_submitted = 0;
    $scope.show_ua_edit = 0;

    $scope.show_bc = 0;
    $scope.show_bc_form = 0;
    $scope.bc_form_submitted = 0;
    $scope.show_bc_edit = 0;
    $scope.multi_select_selected = [];


        //
    $scope.occasions = [];



        $scope.scroll = 0;
    $scope.getCnf = 1;
    $scope.showName = 1;
    $scope.showColor = 0;
    $scope.showHeight = 0;
    $scope.chat = 1;
    $scope.displayText = {};
    $scope.inspiration_selected;
    $scope.results = [""];
    $scope.currentUser = 'User';
    $scope.chatImage = 'pics/chat_background.png';
    $scope.offcanvas_show_profile = 1;
    $scope.offcanvas_show_edit = 0;
    $scope.view_profile_message = 0;

    //Benefit variables
    $scope.show_all_benefits = 0;
    $scope.all_benefits = [];
    $scope.all_benefits_type = [];
    $scope.applied_benefits = [];
    $scope.multiselect_keys = [];


    $scope.ref = 0;
    $scope.temp_total_items = 0;
    $scope.temp_headings = "";



    $scope.resultCame = 1;
    $scope.first_time_heading = 1;
    $scope.chat_callback_data = [];


  
    $scope.active_age = "";
    $scope.active_height = "";
    $scope.active_bodyshape = "";
    $scope.active_skintone = "";
    $scope.active_bc = [];



    $timeout(function () {
        $scope.show_page = 1;
        console.log('showload at .starting>' + $scope.showload);
    }, 1000);
    ////
    var nameToKey = {
        "tops": "women_tops",
        "dresses": "women_dresses",
        "kurtas": "women_kurta",
        "jeans": "women_jeans",
        "tshirts": "women_tshirts",
        "jackets": "women_jackets",
        "heels": "women_heels",
        "handbags": "women_handbags",
        "flats": "women_flats",
        "casual_shoes": "women_casual_shoes",
        "trousers": "women_trousers",
        "sweatshirts": "women_sweatshirts",
        "shirts": "women_shirts",
        "shorts": "women_shorts",
        "skirts": "women_skirts",
        "sweaters": "women_sweaters",
        "capris": "women_capris",
        "blazers": "women_blazers",
        "jeggings": "women_jeggings",
        "jumpsuits": "women_jumpsuits"
    };

    var occasion_mapping = {
        "women_shirts": {
            "office-wear": "Office Wear",
            "casual-wear": "Casual Wear",
            "formal": "Formal",
            "semi-formal": "Semi-Formal",
            "casual": "Casual",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "daily-wear": "Daily wear",
            "college": "College",
            "holiday-trips": "Holiday Trips",
            "beach": "Beach"
        },
        "women_skirts": {
            "office-wear": "Office Wear",
            "casual-wear": "Casual Wear",
            "party-wear": "Party Wear",
            "formal": "Formal",
            "semi-formal": "Semi-Formal",
            "casual": "Casual",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "daily-wear": "Daily wear",
            "college": "College",
            "beach": "Beach",
            "holiday-trips": "Holiday Trips",
            "date": "Date",
            "cocktail": "Cocktail",
            "office-party": "Office Party",
            "clubbing": "Clubbing",
            "house-party": "House Party",
            "college-party": "College Party",
            "birthday": "Birthday",
            "anniversary": "Anniversary",
            "pool-party": "Pool Party"
        },
        "women_trousers": {
            "office-wear": "Office Wear",
            "casual-wear": "Casual Wear",
            "party-wear": "Party Wear",
            "formal": "Formal",
            "semi-formal": "Semi-Formal",
            "casual": "Casual",
            "beach": "Beach",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "daily-wear": "Daily wear",
            "college": "College",
            "holiday-trips": "Holiday Trips",
            "office-party": "Office Party",
            "college-party": "College Party",
            "birthday": "Birthday",
            "anniversary": "Anniversary",
            "hot": "Hot",
            "cold": "Cold"
        },
        "women_shorts": {
            "casual-wear": "Casual Wear",
            "party-wear": "Party Wear",
            "sports-wear": "Sports Wear",
            "beach": "Beach",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "daily-wear": "Daily wear",
            "college": "College",
            "holiday-trips": "Holiday Trips",
            "pool-party": "Pool Party",
            "clubbing": "Clubbing",
            "house-party": "House Party",
            "college-party": "College Party"
        },
        "women_sweatshirts": {
            "active-wear": "Active Wear",
            "daily-wear": "Daily Wear",
            "college-wear": "College wear",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "movie": "Movie",
            "others": "Others"
        },
        "women_sweaters": {
            "office-wear": "Office Wear",
            "daily-wear-casual": "Daily Wear Casual",
            "college-wear": "College Wear",
            "others": "Others",
            "holiday-trips": "Holiday Trips",
            "special-events": "Special Events"
        },
        "women_capris": {
            "casual-wear": "Casual Wear",
            "beach": "Beach",
            "pool-party": "Pool Party",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "daily-wear": "Daily wear",
            "college": "College",
            "holiday-trips": "Holiday Trips"
        },
        "women_jeggings": {
            "office-wear": "Office Wear",
            "casual-wear": "Casual Wear",
            "party-wear": "Party Wear",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "daily-wear": "Daily wear",
            "college": "College",
            "holiday-trips": "Holiday Trips",
            "clubbing": "Clubbing",
            "house-party": "House Party",
            "college-party": "College Party",
            "birthday": "Birthday",
            "anniversary": "Anniversary"
        },
        "women_jumpsuits": {
            "office-wear": "Office Wear",
            "casual-wear": "Casual Wear",
            "party-wear": "Party Wear",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "beach-wear": "Beach wear",
            "daily-wear": "Daily wear",
            "college": "College",
            "holiday-trips": "Holiday Trips",
            "date": "Date",
            "clubbing": "Clubbing",
            "house-party": "House Party",
            "college-party": "College Party",
            "birthday": "Birthday",
            "anniversary": "Anniversary"
        },
        "women_blazers": {
            "office-wear": "Office Wear",
            "casual-wear": "Casual Wear",
            "party-wear": "Party Wear",
            "semi-formal": "Semi-Formal",
            "casual": "Casual",
            "cocktail": "Cocktail",
            "office-party": "Office Party",
            "birthday": "Birthday",
            "anniversary": "Anniversary",
            "date": "Date",
            "clubbing": "Clubbing",
            "house-party": "House Party",
            "hot": "Hot",
            "cold": "Cold"
        },
        "women_dresses": {
            "office-wear": "Office Wear",
            "beach": "Beach",
            "pool-party": "Pool Party",
            "casual-wear": "Casual Wear",
            "wedding": "Wedding",
            "party-wear": "Party Wear",
            "formal": "Formal",
            "semi-formal": "Semi-Formal",
            "casual": "Casual",
            "hot": "Hot",
            "cold": "Cold",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "daily-wear": "Daily wear",
            "college": "College",
            "simple": "Simple",
            "heavy": "Heavy",
            "cocktail": "Cocktail",
            "office-party": "Office Party",
            "clubbing": "Clubbing",
            "house-party": "House Party",
            "college-party": "College Party",
            "birthday": "Birthday",
            "anniversary": "Anniversary"
        },
        "women_tops": {
            "special-occasion-wear": "Special Occasion Wear",
            "office-wear": "Office Wear",
            "casual-wear": "Casual Wear",
            "party-wear": "Party Wear",
            "date": "Date",
            "birthday": "Birthday",
            "anniversary": "Anniversary",
            "festival": "Festival",
            "others": "Others",
            "formal": "Formal",
            "semi-formal": "Semi-Formal",
            "casual": "Casual",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "daily-wear": "Daily wear",
            "college": "College",
            "beach": "Beach",
            "pool-party": "Pool Party",
            "holidays": "Holidays",
            "college-party": "College Party",
            "cocktail": "Cocktail",
            "office-party": "Office Party",
            "clubbing": "Clubbing",
            "house-party": "House Party",
            "simple": "Simple",
            "heavy": "Heavy",
            "hot": "Hot",
            "cold": "Cold"
        },
        "women_tshirts": {
            "casual-wear": "Casual Wear",
            "sports-wear": "Sports Wear",
            "office-wear": "Office wear",
            "party-wear": "Party wear",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "daily-wear": "Daily wear",
            "college": "College",
            "holidays": "Holidays",
            "indoor-sports": "Indoor sports",
            "gym": "gym",
            "yoga": "Yoga",
            "aerobics": "Aerobics",
            "outdoor-sports": "outdoor sports",
            "trekking": "Trekking",
            "mountain-climbing": "Mountain climbing",
            "swimming": "Swimming",
            "cycling": "cycling",
            "hot": "Hot",
            "cold": "Cold",
            "clubbing": "Clubbing",
            "house-party": "House Party",
            "college-party": "College Party",
            "birthday-party": "Birthday Party",
            "anniversary-party": "Anniversary Party"
        },
        "women_kurta": {
            "special-occasion-wear": "Special Occasion Wear",
            "office-wear": "Office Wear",
            "casual-wear": "Casual Wear",
            "date": "Date",
            "birthday": "Birthday",
            "anniversary": "Anniversary",
            "festival": "Festival",
            "cocktail": "Cocktail",
            "office-party": "Office Party",
            "wedding": "Wedding",
            "others": "Others",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "daily-wear": "Daily wear",
            "college": "College",
            "holidays": "Holidays",
            "formal": "Formal",
            "semi-formal": "Semi-Formal",
            "casual": "Casual",
            "simple": "Simple",
            "heavy": "Heavy",
            "hot": "Hot",
            "cold": "Cold"
        },
        "women_jeans": {
            "office-wear": "Office Wear",
            "casual-wear": "Casual Wear",
            "party-wear": "Party Wear",
            "semi-formal": "Semi-Formal",
            "casual": "Casual",
            "birthday": "Birthday",
            "anniversary": "Anniversary",
            "date": "Date",
            "cocktail": "Cocktail",
            "office-party": "Office Party",
            "clubbing": "Clubbing",
            "house-party": "House Party"
        },
        "women_jackets": {
            "office-wear": "Office Wear",
            "casual-wear": "Casual Wear",
            "party-wear": "Party Wear",
            "workout-wear": "Workout Wear",
            "travel": "Travel",
            "semi-formal": "Semi-Formal",
            "casual": "Casual",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "daily-wear": "Daily wear",
            "college": "College",
            "cocktail": "Cocktail",
            "office-party": "Office Party",
            "birthday": "Birthday",
            "anniversary": "Anniversary",
            "date": "Date",
            "clubbing": "Clubbing",
            "house-party": "House Party",
            "extreme-cold": "Extreme Cold",
            "windy": "Windy",
            "rainy": "Rainy"
        },
        "women_handbags": {
            "casual": "Casual",
            "party": "Party",
            "special-occasion": "Special Occasion",
            "work": "Work",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "daily-use": "Daily Use",
            "college": "College",
            "holidays": "Holidays",
            "beach-use": "Beach Use",
            "cocktail": "Cocktail",
            "office-party": "Office Party",
            "clubbing": "Clubbing",
            "house-party": "House Party",
            "college-party": "College Party",
            "birthday": "Birthday",
            "anniversary": "Anniversary",
            "date": "Date",
            "festivals": "Festivals",
            "weddings": "Weddings",
            "formal": "Formal"
        },
        "women_flats": {
            "casual": "Casual",
            "party": "Party",
            "work": "Work",
            "special-occasion": "Special Occasion",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "holidays": "Holidays",
            "daily-wear": "Daily wear",
            "college": "College",
            "beach-wear": "Beach Wear",
            "cocktail": "Cocktail",
            "office-party": "Office Party",
            "clubbing": "Clubbing",
            "house-party": "House Party",
            "college-party": "College Party",
            "birthday": "Birthday",
            "anniversary": "Anniversary",
            "date": "Date",
            "festivals": "Festivals",
            "weddings": "Weddings",
            "others": "Others",
            "formal": "Formal"
        },
        "women_heels": {
            "casual": "Casual",
            "party": "Party",
            "work": "Work",
            "special-occasion": "Special Occasion",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "holidays": "Holidays",
            "daily-wear": "Daily wear",
            "college": "College",
            "beach-wear": "Beach Wear",
            "cocktail": "Cocktail",
            "office-party": "Office Party",
            "clubbing": "Clubbing",
            "house-party": "House Party",
            "college-party": "College Party",
            "birthday": "Birthday",
            "anniversary": "Anniversary",
            "date": "Date",
            "festivals": "Festivals",
            "weddings": "Weddings",
            "others": "Others",
            "formal": "Formal"
        },
        "women_casual_shoes": {
            "office-wear": "Office Wear",
            "casual-wear": "Casual Wear",
            "party-wear": "Party Wear",
            "semi-formal": "Semi-Formal",
            "lunch": "Lunch",
            "brunch": "Brunch",
            "dinner": "Dinner",
            "movie": "Movie",
            "holidays": "Holidays",
            "beach-wear": "Beach Wear",
            "daily-wear": "Daily wear",
            "college": "College",
            "birthday": "Birthday",
            "anniversary": "Anniversary",
            "date": "Date",
            "clubbing": "Clubbing",
            "house-party": "House Party"
        }
    };

    var attribute_value_default_keys = {
        "adults-women": "age_group",
        "adults-unisex": "age_group",
        "adults-men": "age_group",
        "printed": "pattern",
        "solid": "pattern",
        "woven design / self prints": "base_design",
        "yoke design": "base_design",
        "colourblocked": "base_design",
        "embroidered": "base_design",
        "tie and dye": "pattern_type",
        "slim": "fit",
        "regular fit": "fit",
        "straight fit": "brand_fit_name",
        "skinny": "brand_fit_name",
        "classic": "brand_fit_name",
        "comfort": "fit",
        "relaxed": "fit",
        "loose": "fit",
        "fitted": "fit",
        "leaner": "brand_fit_name",
        "default": "brand_fit_name",
        "super skinny fit": "fit",
        "jeggings fit": "brand_fit_name",
        "veronica fit": "brand_fit_name",
        "amy fit": "brand_fit_name",
        "twiggy fit": "brand_fit_name",
        "frisky fit": "brand_fit_name",
        "super slim fit": "brand_fit_name",
        "lucy fit": "brand_fit_name",
        "maxi": "type",
        "lean fit": "brand_fit_name",
        "hottie fit": "brand_fit_name",
        "tapered": "fit",
        "molly fit": "brand_fit_name",
        "elite fit": "brand_fit_name",
        "jane fit": "brand_fit_name",
        "hollywood fit": "brand_fit_name",
        "power skinny": "brand_fit_name",
        "pixie fit": "brand_fit_name",
        "skinny cropped fit": "brand_fit_name",
        "chelsea fit": "brand_fit_name",
        "skinny pencil fit": "brand_fit_name",
        "skinny straight fit": "brand_fit_name",
        "eva fit": "brand_fit_name",
        "body fit": "brand_fit_name",
        "smart fit": "brand_fit_name",
        "anti fit": "brand_fit_name",
        "bootilicious fit": "brand_fit_name",
        "narrow fit": "brand_fit_name",
        "holborne fit": "brand_fit_name",
        "cindy fit": "brand_fit_name",
        "prince fit": "brand_fit_name",
        "alba": "brand",
        "roadster": "brand",
        "campus sutra": "brand",
        "forever 21": "brand",
        "happy hippie": "brand",
        "kook n keech": "brand",
        "adidas neo": "brand",
        "nike": "brand",
        "ether": "brand",
        "cult fiction": "brand",
        "dressberry": "brand",
        "fila": "brand",
        "neva": "brand",
        "pepe jeans": "brand",
        "puma": "brand",
        "mango": "brand",
        "lee": "brand",
        "hrx by hrithik roshan": "brand",
        "ajile by pantaloons": "brand",
        "adidas originals": "brand",
        "silly people": "brand",
        "mast & harbour": "brand",
        "new look": "brand",
        "only": "brand",
        "miss chase": "brand",
        "adidas": "brand",
        "donald duck": "brand",
        "johnny bravo": "brand",
        "reebok": "brand",
        "all about you": "brand",
        "faballey": "brand",
        "ywc": "brand",
        "kook n keech marvel": "brand",
        "pluss": "brand",
        "flying machine": "brand",
        "alcott": "brand",
        "wrangler": "brand",
        "g-star raw": "brand",
        "united colors of benetton": "brand",
        "champion": "brand",
        "asics": "brand",
        "disney by dressberry": "brand",
        "hypernation": "brand",
        "purys": "brand",
        "boohoo": "brand",
        "honey by pantaloons": "brand",
        "kook n keech disney": "brand",
        "harvard": "brand",
        "tommy hilfiger": "brand",
        "elle": "brand",
        "vero moda": "brand",
        "ms.taken": "brand",
        "harry potter": "brand",
        "marks & spencer": "brand",
        "mickey & friends": "brand",
        "reebok classic": "brand",
        "converse": "brand",
        "jockey": "brand",
        "levis": "brand",
        "cation": "brand",
        "ativo": "brand",
        "game of thrones": "brand",
        "columbia": "brand",
        "style quotient": "brand",
        "proline active": "brand",
        "sera": "brand",
        "bossini": "brand",
        "metersbonwe": "brand",
        "simpsons": "brand",
        "silvian heach": "brand",
        "the north face": "brand",
        "marie claire": "brand",
        "undercolors of benetton": "brand",
        "texco": "brand",
        "2go": "brand",
        "tshirtcompany": "brand",
        "people": "brand",
        "incynk": "brand",
        "kook n keech music": "brand",
        "vaak": "brand",
        "the vanca": "brand",
        "femella": "brand",
        "vans": "brand",
        "sf jeans by pantaloons": "brand",
        "noi": "brand",
        "tweety": "brand",
        "hulk": "brand",
        "nirvana": "brand",
        "superdry": "brand",
        "rigo": "brand",
        "beatles": "brand",
        "marvel": "brand",
        "20dresses": "brand",
        "van heusen woman": "brand",
        "suicide squad": "brand",
        "why knot": "brand",
        "numero uno": "brand",
        "noble faith": "brand",
        "sela": "brand",
        "ed hardy": "brand",
        "rider republic": "brand",
        "label ritu kumar": "brand",
        "bedazzle": "brand",
        "american swan": "brand",
        "kaaryah": "brand",
        "being human": "brand",
        "guess": "brand",
        "punk": "brand",
        "u.s. polo assn. women": "brand",
        "softwear": "brand",
        "altomoda by pantaloons": "brand",
        "batgirl": "brand",
        "park avenue": "brand",
        "kazo": "brand",
        "garfield": "brand",
        "free authority": "brand",
        "barbie": "brand",
        "rolling stone": "brand",
        "monte carlo": "brand",
        "colors couture": "brand",
        "pink floyd": "brand",
        "shuffle": "brand",
        "cherymoya": "brand",
        "manola": "brand",
        "rattrap": "brand",
        "loco en cabeza": "brand",
        "tarun tahiliani": "brand",
        "alibi": "brand",
        "miss chick": "brand",
        "family guy": "brand",
        "spykar": "brand",
        "meira": "brand",
        "gas": "brand",
        "calvin klein jeans": "brand",
        "calgari": "brand",
        "arrow woman": "brand",
        "russell athletic": "brand",
        "iron man": "brand",
        "park avenue woman": "brand",
        "candies by pantaloons": "brand",
        "harley-davidson®": "brand",
        "quiz": "brand",
        "ginger by lifestyle": "brand",
        "smiley world": "brand",
        "prettysecrets": "brand",
        "madame": "brand",
        "kappa": "brand",
        "ridress": "brand",
        "cover story": "brand",
        "free & young": "brand",
        "kraus jeans": "brand",
        "riot": "brand",
        "mizuno": "brand",
        "de moza": "brand",
        "jn joy": "brand",
        "looney tunes": "brand",
        "linkin park": "brand",
        "harley davidson": "brand",
        "rinascimento": "brand",
        "captain america": "brand",
        "french connection": "brand",
        "street 9": "brand",
        "dexters laboratory": "brand",
        "mustard": "colour",
        "mickey": "br#FFFFFF_name",
        "dawn of justice": "brand",
        "laabha": "brand",
        "tom & jerry": "brand",
        "fox": "brand",
        "ceylin": "brand",
        "oshea": "brand",
        "anasazi": "brand",
        "gabi": "brand",
        "fab deanta": "brand",
        "saiesta": "brand",
        "red dot": "brand",
        "heart 2 heart": "brand",
        "spunk": "brand",
        "fame forever by lifestyle": "brand",
        "meish": "brand",
        "rsvp cross": "brand",
        "vaishvik": "brand",
        "nautica": "brand",
        "fugue": "brand",
        "tab91": "brand",
        "feneto": "brand",
        "tokyo talkies": "brand",
        "globus": "brand",
        "chumbak": "brand",
        "jazzup": "brand",
        "replay": "brand",
        "sbuys": "brand",
        "icc": "brand",
        "restless": "brand",
        "eavan": "brand",
        "sherlock": "brand",
        "guns & roses": "brand",
        "dc comics": "brand",
        "desigual": "brand",
        "roxy": "brand",
        "le bison": "brand",
        "kook n keech garfield": "brand",
        "pluto": "brand",
        "sisley": "brand",
        "faballey curve": "brand",
        "bare": "brand",
        "bebe": "brand",
        "thelabellife.com": "brand",
        "northern lights": "brand",
        "wills lifestyle": "brand",
        "next": "brand",
        "lee cooper": "brand",
        "dorothy perkins": "brand",
        "2go active gear usa": "brand",
        "renka": "brand",
        "planet superheroes": "brand",
        "under colors of benetton": "brand",
        "tantra": "brand",
        "amari west": "brand",
        "alcis": "brand",
        "mexx": "brand",
        "espresso": "brand",
        "amydus": "brand",
        "ultrafit": "brand",
        "grain": "brand",
        "alto moda by pantaloons": "brand",
        "change360°": "brand",
        "seven": "brand",
        "rham": "brand",
        "hummel": "brand",
        "the simpsons": "brand",
        "urban yoga": "brand",
        "oxolloxo": "brand",
        "vvine": "brand",
        "levi's": "brand",
        "rare": "brand",
        "jealous 21": "brand",
        "tom tailor": "brand",
        "evah": "brand",
        "shaftesbury london": "brand",
        "crimsoune club": "brand",
        "fritzberg": "brand",
        "lee marc": "brand",
        "antigravity": "brand",
        "lastinch": "brand",
        "iralzo": "brand",
        "mabish by sonal jain": "brand",
        "tarama": "brand",
        "tshirt company": "brand",
        "sherlock holmes": "brand",
        "rena love": "brand",
        "supergirl": "brand",
        "abhishti": "brand",
        "stylestone": "brand",
        "kira plus": "brand",
        "the cotton company": "brand",
        "adro": "brand",
        "izabel london by pantaloons": "brand",
        "vea kupia": "brand",
        "jc collection": "brand",
        "paprika": "brand",
        "kriti": "brand",
        "mamacouture": "brand",
        "zola": "brand",
        "prym": "brand",
        "mine4nine": "brand",
        "cashewnut": "brand",
        "yepme": "brand",
        "besiva": "brand",
        "l'elegantae": "brand",
        "uni style image": "brand",
        "blacksoul": "brand",
        "club york": "brand",
        "mystree": "brand",
        "penny by zivame": "brand",
        "bkind": "brand",
        "duke": "brand",
        "eves pret a porter": "brand",
        "berge": "brand",
        "talinum": "brand",
        "say it loud": "brand",
        "remanika": "brand",
        "ruhaan's": "brand",
        "cat": "brand",
        "hbhwear": "brand",
        "proline": "brand",
        "akkriti by pantaloons": "brand",
        "u.s. polo assn.": "brand",
        "taanz": "brand",
        "topshop": "brand",
        "american crew": "brand",
        "imagica": "brand",
        "ama bella": "brand",
        "rig": "brand",
        "morgan": "brand",
        "global desi": "brand",
        "aquamagica": "brand",
        "chique": "brand",
        "lucero": "brand",
        "fast n fashion": "brand",
        "the dry state": "brand",
        "chlorophile": "brand",
        "status quo": "brand",
        "atheno": "brand",
        "sugar her": "brand",
        "missguided": "brand",
        "marilyn monroe": "brand",
        "nba": "brand",
        "miss bennett london": "brand",
        "desi urban": "brand",
        "clovia": "brand",
        "famaya": "brand",
        "wineberry": "brand",
        "t10 sports": "brand",
        "fifa": "brand",
        "leo sansini": "brand",
        "panit": "brand",
        "335th": "brand",
        "instacrush": "brand",
        "riot jeans": "brand",
        "splash": "brand",
        "zalora": "brand",
        "27ashwood": "brand",
        "batman": "brand",
        "mb": "brand",
        "tagd new york": "brand",
        "revo": "brand",
        "claude 9": "brand",
        "wisstler": "brand",
        "new balance": "brand",
        "wolfpack": "brand",
        "nordic bazaar": "brand",
        "kraus": "brand",
        "rampwalk": "brand",
        "postfold": "brand",
        "van heusen": "brand",
        "zoefemme": "brand",
        "saiints": "brand",
        "silverswan": "brand",
        "river island": "brand",
        "pannkh": "brand",
        "c9": "brand",
        "pab jules": "brand",
        "frost": "brand",
        "bongio": "brand",
        "ladybug": "brand",
        "vedic": "brand",
        "tangerine clothing": "brand",
        "freecultr": "brand",
        "jojo maman bebe": "brand",
        "archie": "brand",
        "ap'pulse": "brand",
        "reflete": "brand",
        "no code": "brand",
        "cft": "brand",
        "faireno": "brand",
        "ar2": "brand",
        "identiti": "brand",
        "meiro": "brand",
        "mbe": "brand",
        "belle fille": "brand",
        "athena": "brand",
        "fashionable": "brand",
        "kothari": "brand",
        "blue sequin": "brand",
        "desinvolt": "brand",
        "hanes": "brand",
        "s.oliver": "brand",
        "lola skye": "brand",
        "annabelle by pantaloons": "brand",
        "species": "brand",
        "fort collins": "brand",
        "trend18": "brand",
        "cottonworld": "brand",
        "x'pose": "brand",
        "sister's point": "brand",
        "skidlers": "brand",
        "sml originals": "brand",
        "popnetic": "brand",
        "trend arrest": "brand",
        "moda rapido": "brand",
        "la zoire": "brand",
        "harpa": "brand",
        "schwof": "brand",
        "sassafras": "brand",
        "u&f": "brand",
        "imara": "brand",
        "fabindia": "brand",
        "ira soleil": "brand",
        "cottinfab": "brand",
        "hapuka": "brand",
        "hook & eye": "brand",
        "ruhaans": "brand",
        "bhama couture": "brand",
        "anouk": "brand",
        "envy me": "brand",
        "raindrops": "brand",
        "veni vidi vici": "brand",
        "la firangi": "brand",
        "faballey indya": "brand",
        "lynda": "brand",
        "h.o.g": "brand",
        "biba": "brand",
        "9rasa": "brand",
        "i know": "brand",
        "jaypore": "brand",
        "abiti bella": "brand",
        "and": "closure",
        "ants": "brand",
        "folklore": "brand",
        "w": "brand",
        "taurus": "brand",
        "allen solly woman": "brand",
        "fusion beats": "brand",
        "aum": "brand",
        "nun": "brand",
        "magnetic designs": "brand",
        "global colours": "brand",
        "zima leto": "brand",
        "gipsy": "brand",
        "golden girl": "brand",
        "florrie fusion": "brand",
        "porsorte": "brand",
        "color cocktail": "brand",
        "cayman": "brand",
        "eyelet": "brand",
        "pryma donna": "brand",
        "l elegantae": "brand",
        "latin quarters": "brand",
        "meee": "brand",
        "zastraa": "brand",
        "studio rasa": "brand",
        "shakumbhari": "brand",
        "fashion wardrobe": "brand",
        "jaipur kurti": "brand",
        "rangriti": "brand",
        "indusdiva": "brand",
        "the gud look": "brand",
        "rigoglioso": "brand",
        "bella rosa": "brand",
        "109f": "brand",
        "brass tacks": "brand",
        "la stella": "brand",
        "purplicious": "brand",
        "citrine": "brand",
        "soch": "brand",
        "deal jeans": "brand",
        "soie": "brand",
        "bandhej": "brand",
        "avirate": "brand",
        "aurelia": "brand",
        "label vr": "brand",
        "d muse by dressberry": "brand",
        "aaboli": "brand",
        "code by lifestyle": "brand",
        "zink london": "brand",
        "encrypt": "brand",
        "oranje clothing": "brand",
        "bombay high": "brand",
        "indian ink": "brand",
        "printalk": "brand",
        "xpose": "brand",
        "ss": "brand",
        "honey & b": "brand",
        "uptown galeria": "brand",
        "toscee": "brand",
        "libas": "brand",
        "kilol": "brand",
        "nvl": "brand",
        "i am for you": "brand",
        "mai haramaki": "brand",
        "vishudh": "brand",
        "msmb": "brand",
        "pera doce": "brand",
        "hotberries": "brand",
        "butterfly wears": "brand",
        "indibox": "brand",
        "nayo": "brand",
        "kaxiaa": "brand",
        "darling": "brand",
        "varanga": "brand",
        "akiva": "brand",
        "sweet lemon": "brand",
        "rain & rainbow": "brand",
        "femenino": "brand",
        "mineral": "brand",
        "blues by the vanca": "brand",
        "martini": "brand",
        "famous by payal kapoor": "brand",
        "purple feather": "brand",
        "amor": "brand",
        "ayaany": "brand",
        "aruni designs": "brand",
        "lokal south": "brand",
        "shree": "brand",
        "disney by anouk": "brand",
        "gerua": "brand",
        "nineteen": "brand",
        "red sister blue": "brand",
        "melange by lifestyle": "brand",
        "7 colors life style": "brand",
        "masaba for anouk": "brand",
        "rose vanessa": "brand",
        "fuziv": "brand",
        "xny": "brand",
        "suo": "brand",
        "bitterlime": "brand",
        "ishin": "brand",
        "mohr": "brand",
        "citypret": "brand",
        "trend 18": "brand",
        "castle": "brand",
        "desi weaves": "brand",
        "sepia": "brand",
        "engross": "brand",
        "upper class": "brand",
        "indian by manish arora": "brand",
        "la rochelle": "brand",
        "elisabetta bartolli": "brand",
        "juniper": "brand",
        "amari": "brand",
        "beyouty": "brand",
        "pehraan": "brand",
        "inmark": "brand",
        "zaivaa": "brand",
        "blink": "brand",
        "atorse": "brand",
        "private lives": "brand",
        "chm": "brand",
        "fashion union": "brand",
        "vvoguish": "brand",
        "ten on ten": "brand",
        "mayra": "brand",
        "primo knot": "brand",
        "riya": "brand",
        "cora": "brand",
        "shibori designs": "brand",
        "mystere paris": "brand",
        "pour femme": "brand",
        "sangria": "brand",
        "pick pocket": "brand",
        "today fashion": "brand",
        "albely": "brand",
        "anekdote": "brand",
        "indietoga": "brand",
        "baloono": "brand",
        "silk weavers": "brand",
        "lamora": "brand",
        "raaziba": "brand",
        "garrb": "brand",
        "shilpkala fns": "brand",
        "at by taruna": "brand",
        "uvr": "brand",
        "srota": "brand",
        "shwetna": "brand",
        "indiwagon": "brand",
        "yufta": "brand",
        "threesome": "brand",
        "miss queen": "brand",
        "manka": "brand",
        "rrajsee": "brand",
        "moda desire": "brand",
        "merch 21": "brand",
        "sabhyata": "brand",
        "@499": "brand",
        "lili blank": "brand",
        "inddus": "brand",
        "ritzzy": "brand",
        "parinita": "brand",
        "vastrasutra": "brand",
        "dede's": "brand",
        "n-gal": "brand",
        "haute curry by shoppers stop": "brand",
        "ozel": "brand",
        "desi belle": "brand",
        "the kaftan company": "brand",
        "miss forever": "brand",
        "109°f": "brand",
        "sanchey": "brand",
        "vedanta": "brand",
        "taaga": "brand",
        "visach": "brand",
        "lara karen": "brand",
        "tops and tunics": "brand",
        "curvy q": "brand",
        "sdl by sweet dreams": "brand",
        "my addiction": "brand",
        "kinmin": "brand",
        "urban helsinki": "brand",
        "motif": "brand",
        "lubaba": "brand",
        "colornext": "brand",
        "la verve": "brand",
        "camino": "brand",
        "glam & luxe": "brand",
        "fio": "brand",
        "splendent": "brand",
        "aks couture": "brand",
        "trendy divva": "brand",
        "mocking bird": "brand",
        "james scot": "brand",
        "miaminx": "brand",
        "dressvilla": "brand",
        "lady stark": "brand",
        "philigree": "brand",
        "mother earth": "brand",
        "cladien": "brand",
        "ziyaa": "brand",
        "bainy": "brand",
        "miway": "brand",
        "da intimo": "brand",
        "peptrends": "brand",
        "goodwill": "brand",
        "viva n diva": "brand",
        "stylebay": "brand",
        "vteens": "brand",
        "femninora": "brand",
        "roving mode": "brand",
        "mod pluss": "brand",
        "ruhanee": "brand",
        "aaliya woman": "brand",
        "design house": "brand",
        "coash": "brand",
        "good fashion": "brand",
        "rare prive": "brand",
        "bandbox": "brand",
        "shonaya": "brand",
        "uptownie lite": "brand",
        "one femme": "brand",
        "ucla": "brand",
        "vajor": "brand",
        "avaana": "brand",
        "guster ve": "brand",
        "topshop-outlet": "brand",
        "zupe": "brand",
        "millefleur": "brand",
        "love from india": "brand",
        "tulsattva": "brand",
        "lyla": "brand",
        "bodycare": "brand",
        "chhipaprints": "brand",
        "hot berries": "brand",
        "mint": "brand",
        "uttam": "brand",
        "indicot": "brand",
        "lisova": "brand",
        "strak": "brand",
        "deewa": "brand",
        "funk for hire": "brand",
        "kyaara": "brand",
        "binny": "brand",
        "prayyan": "brand",
        "just wow": "brand",
        "mirika": "brand",
        "indian dobby": "brand",
        "allen solly": "brand",
        "oranje": "brand",
        "svt ada collection": "brand",
        "ruham": "brand",
        "urbanroots": "brand",
        "liqvid": "brand",
        "vibe": "brand",
        "g": "brand",
        "iti": "brand",
        "pretty simple": "brand",
        "miss selfridge": "brand",
        "ethniclook": "brand",
        "ans asthaandsidharth": "brand",
        "trendif": "brand",
        "crosstitch": "brand",
        "the silhouette store": "brand",
        "theofficewalk": "brand",
        "ashtag": "brand",
        "mango-outlet": "brand",
        "uptowngaleria": "brand",
        "crisp outfitters": "brand",
        "scarlet ross": "brand",
        "eva de moda": "brand",
        "hitch-ki": "brand",
        "free spirited": "brand",
        "idk": "brand",
        "holidae": "brand",
        "upperclass": "brand",
        "bohemyan blue": "brand",
        "uv&w": "brand",
        "mona glamour": "brand",
        "stalk.buy.love": "brand",
        "closet curves": "brand",
        "bazel": "brand",
        "mytri": "brand",
        "zotw": "brand",
        "nidhi munim": "brand",
        "closet drama": "brand",
        "dhrohar": "brand",
        "preeti tomar": "brand",
        "viro": "brand",
        "avirich": "brand",
        "wild hawk": "brand",
        "ojjasvi": "brand",
        "rage": "brand",
        "saieraa": "brand",
        "preeti s kapoor": "brand",
        "swatee singh": "brand",
        "pink lace": "brand",
        "scullers for her": "brand",
        "divaat": "brand",
        "fahd khatri": "brand",
        "lgc": "brand",
        "genes - lecoanet hemant": "brand",
        "mangosteen": "brand",
        "amante": "brand",
        "tokichoi": "brand",
        "quittance": "brand",
        "soup": "brand",
        "satya paul": "brand",
        "orchids sutraa": "brand",
        "calvin klein underwear": "brand",
        "women republic": "brand",
        "saanvi": "brand",
        "neemrana collection": "brand",
        "diya": "brand",
        "w.a.y": "brand",
        "jayati goenka": "brand",
        "divina": "brand",
        "code 61": "brand",
        "7 for all mankind": "brand",
        "xblues": "brand",
        "lesley": "brand",
        "gofab": "brand",
        "fungus": "brand",
        "hubberholme": "brand",
        "westwood": "brand",
        "high star": "brand",
        "devis": "brand",
        "go fab": "brand",
        "clench": "brand",
        "carrie": "brand",
        "king & i": "brand",
        "urban navy": "brand",
        "pure play": "brand",
        "owncraft": "brand",
        "bareskin": "brand",
        "oner": "brand",
        "c vox": "brand",
        "okane": "brand",
        "ilk": "brand",
        "aks": "brand",
        "mirage": "brand",
        "miss grace": "brand",
        "mago": "brand",
        "priknit": "brand",
        "sobre estilo": "brand",
        "very me": "brand",
        "be indi": "brand",
        "aditi wasan": "brand",
        "twist n wraps by nidhi": "brand",
        "shoetopia": "brand",
        "lavie": "brand",
        "mochi": "brand",
        "kielz": "brand",
        "carlton london": "brand",
        "metro": "brand",
        "catwalk": "brand",
        "truffle collection": "brand",
        "qupid": "brand",
        "solovoga": "brand",
        "clarks": "brand",
        "bata": "brand",
        "wet blue": "brand",
        "footin": "brand",
        "inc 5": "brand",
        "crocs": "brand",
        "dr. scholl": "brand",
        "bruno manetti": "brand",
        "geox": "brand",
        "ilo": "brand",
        "steve madden": "brand",
        "flat n heels": "brand",
        "get glamr": "brand",
        "chalk studio": "brand",
        "nell": "brand",
        "red pout": "brand",
        "paduki": "brand",
        "tresmode": "brand",
        "addons": "brand",
        "marc loire": "brand",
        "knotty derby": "brand",
        "hush puppies": "brand",
        "rocia": "brand",
        "tao paris": "brand",
        "jove": "brand",
        "hats off accessories": "brand",
        "urbane": "brand",
        "vero couture": "brand",
        "footilicious": "brand",
        "berry purple": "brand",
        "intoto": "brand",
        "paprika by lifestyle": "brand",
        "aerosoles": "brand",
        "signature sole": "brand",
        "heatwave": "brand",
        "cobblerz": "brand",
        "guava": "brand",
        "nine west": "brand",
        "aldo": "brand",
        "toms": "brand",
        "lamere": "brand",
        "fiorella": "brand",
        "zebba": "brand",
        "soludos": "brand",
        "la briza": "brand",
        "timberland": "brand",
        "blue button": "brand",
        "alberto torresi": "brand",
        "soft & sleek": "brand",
        "klaur melbourne": "brand",
        "ceriz": "brand",
        "pavers england": "brand",
        "mft couture": "brand",
        "olmiite": "brand",
        "inc.5": "brand",
        "shoe couture": "brand",
        "z collection": "brand",
        "valentino": "brand",
        "lishabee by msc": "brand",
        "under knee": "brand",
        "legsway": "brand",
        "zaera": "brand",
        "adamis": "brand",
        "lovely chick": "brand",
        "glitzy galz": "brand",
        "london rebel": "brand",
        "j collection": "brand",
        "meriggiare": "brand",
        "sleek italia": "brand",
        "call it spring": "brand",
        "d by dune": "brand",
        "steppings": "brand",
        "salt n pepper": "brand",
        "dune": "brand",
        "liberty": "brand",
        "shuz touch": "brand",
        "shuberry": "brand",
        "liza": "brand",
        "ten": "brand",
        "bugatti": "brand",
        "zachho": "brand",
        "delize": "brand",
        "tycoon": "brand",
        "msc": "brand",
        "vanilla moon": "brand",
        "lyrics london": "brand",
        "elly": "brand",
        "kraft cellar": "brand",
        "flora": "brand",
        "essie peck": "brand",
        "cocoon": "brand",
        "my foot": "brand",
        "esse by esse pelle": "brand",
        "siendo desi": "brand",
        "portia": "brand",
        "indulgence": "brand",
        "fab fashion": "brand",
        "action": "brand",
        "glameous": "brand",
        "valiosaa": "brand",
        "gnist": "brand",
        "finesse": "brand",
        "funku fashion": "brand",
        "msl": "brand",
        "gisole": "brand",
        "urban woods": "brand",
        "pink fever": "brand",
        "pink 18": "brand",
        "femme": "brand",
        "balujas": "brand",
        "vaph": "brand",
        "hm": "brand",
        "hype": "brand",
        "shoe bazar": "brand",
        "sadana's": "brand",
        "shuz by lifestyle": "brand",
        "wellworth": "brand",
        "do bhai": "brand",
        "urban country": "brand",
        "skechers": "brand",
        "solester": "brand",
        "mb collection": "brand",
        "colors": "brand",
        "footash": "brand",
        "marcoleone": "brand",
        "russo fashion": "brand",
        "pareza": "brand",
        "bonjour": "brand",
        "eske": "brand",
        "waltz": "brand",
        "prom": "brand",
        "lishabee": "brand",
        "kosher": "brand",
        "veruschka by payal kothari": "brand",
        "ccilu": "brand",
        "khadim's": "brand",
        "sharon from khadim's": "brand",
        "cleo from khadim's": "brand",
        "softouch from khadim's": "brand",
        "sir michele": "brand",
        "illy": "brand",
        "enroute women": "brand",
        "sleek": "brand",
        "floy": "brand",
        "yelloe": "brand",
        "utsukushii": "brand",
        "parfois": "brand",
        "vogue tree": "brand",
        "kiara": "brand",
        "bagsy malone": "brand",
        "corsica": "brand",
        "butterflies": "brand",
        "toteteca": "brand",
        "baggit": "brand",
        "david jones": "brand",
        "esbeda": "brand",
        "alessia74": "brand",
        "osaiz": "brand",
        "lino perros": "brand",
        "berrypeckers": "brand",
        "caprese": "brand",
        "anekaant": "brand",
        "vie": "brand",
        "daphne": "brand",
        "beau design": "brand",
        "sg collection": "brand",
        "accessorize": "brand",
        "satchel bags": "brand",
        "fossil": "brand",
        "elespry": "brand",
        "holii": "brand",
        "hidesign": "brand",
        "koel": "brand",
        "aigner": "brand",
        "fur jaden": "brand",
        "pockit": "brand",
        "fastrack": "brand",
        "love moschino": "brand",
        "the house of tara": "brand",
        "ilex": "brand",
        "bendly": "brand",
        "bulchee": "brand",
        "funkyfish": "brand",
        "lemon trunk": "brand",
        "kenneth cole": "brand",
        "kanvas katha": "brand",
        "dice": "brand",
        "alvaro castagnino": "brand",
        "shaun design": "brand",
        "phive rivers": "brand",
        "moedbuille": "brand",
        "toniq": "brand",
        "murcia": "brand",
        "borsavela": "brand",
        "covo": "brand",
        "second skin": "brand",
        "e2o": "brand",
        "f gear": "brand",
        "the ink bucket": "brand",
        "notbad": "brand",
        "skyways": "brand",
        "wildcraft": "brand",
        "carry on": "brand",
        "bern": "brand",
        "cappuccino": "brand",
        "desi drama queen": "brand",
        "gauge machine": "brand",
        "viari": "brand",
        "purseus": "brand",
        "ligans ny": "brand",
        "buckleup": "brand",
        "legal bribe": "brand",
        "femme fatale": "brand",
        "furla": "brand",
        "diesel": "brand",
        "stoln": "brand",
        "donna & drew": "brand",
        "taws": "brand",
        "klasse": "brand",
        "nyk": "brand",
        "mirabel": "brand",
        "kalon": "brand",
        "peperone": "brand",
        "the riders side": "brand",
        "calligraphy": "brand",
        "tkwd leathers": "brand",
        "trendberry": "brand",
        "dickies": "brand",
        "earthen me": "brand",
        "superman": "brand",
        "ellehammer": "brand",
        "evokriti": "brand",
        "autograph": "brand",
        "spice art": "brand",
        "victorinox": "brand",
        "paradigm design lab": "brand",
        "khiora": "brand",
        "harp": "brand",
        "leather talks": "brand",
        "kara": "brand",
        "mac&gitts": "brand",
        "ladida": "brand",
        "toog": "brand",
        "fostelo": "brand",
        "diana korr": "brand",
        "louise & harris": "brand",
        "toteteca bag works": "brand",
        "swiss design": "brand",
        "da milano": "brand",
        "miganda": "brand",
        "bagkok": "brand",
        "abrazo": "brand",
        "lapis o lupo": "brand",
        "anges bags": "brand",
        "la roma": "brand",
        "hopping street": "brand",
        "jugni": "brand",
        "alessia": "brand",
        "3 mad chicks": "brand",
        "ccha": "brand",
        "grace": "brand",
        "ivy": "brand",
        "lomond": "brand",
        "10th planet": "brand",
        "scoop street": "brand",
        "white lily": "brand",
        "donna and drew": "brand",
        "massimo italiano": "brand",
        "cross": "brand",
        "swayam": "brand",
        "vapr": "brand",
        "kaos": "brand",
        "hi look": "brand",
        "sparkle street": "brand",
        "airovit": "brand",
        "be for bag": "brand",
        "not bad": "brand",
        "noel jansen": "brand",
        "justanned": "brand",
        "ellis": "brand",
        "morsei": "brand",
        "rossoyuki": "brand",
        "ruby": "brand",
        "barevogue": "brand",
        "rizir fashion": "brand",
        "rebelt": "brand",
        "be trendy": "brand",
        "moladz": "brand",
        "crunchy fashions": "brand",
        "stol'n": "brand",
        "moac": "brand",
        "teakwood": "brand",
        "senora": "brand",
        "greenobag": "brand",
        "leaf designs": "brand",
        "jademist": "brand",
        "ives": "brand",
        "span": "brand",
        "alom": "brand",
        "kyla f": "brand",
        "kira": "brand",
        "rangeelo rajasthan": "brand",
        "aujjessa": "brand",
        "tissu": "brand",
        "love more": "brand",
        "azira": "brand",
        "rangmanch by pantaloons": "brand",
        "sringam": "brand",
        "aamii": "brand",
        "trishaa by pantaloons": "brand",
        "jashn": "brand",
        "tres belle": "brand",
        "prakhya": "brand",
        "soch outlet": "brand",
        "kurti's by menka": "brand",
        "rajnandini": "brand",
        "chhipa prints": "brand",
        "aaika": "brand",
        "scarleti": "brand",
        "indibelle": "brand",
        "saree mall": "brand",
        "lookslady": "brand",
        "amaanaa": "brand",
        "indi dori": "brand",
        "soul inde": "brand",
        "avishi": "brand",
        "plume": "brand",
        "vaamsi": "brand",
        "designersareez": "brand",
        "saadgi": "brand",
        "fianna": "brand",
        "cenizas": "brand",
        "hypnotex": "brand",
        "glam and luxe": "brand",
        "elife": "brand",
        "geroo jaipur": "brand",
        "omana by kavita bhartia": "brand",
        "kvsfab": "brand",
        "arpn's": "brand",
        "evam": "brand",
        "navriti": "brand",
        "wishful by w": "brand",
        "enchanted drapes": "brand",
        "ahalyaa": "brand",
        "ritu kumar": "brand",
        "zoeyam's": "brand",
        "swaron": "brand",
        "occeanus": "brand",
        "svarikaa": "brand",
        "aik by h&a": "brand",
        "khushali fashion": "brand",
        "rebecca": "brand",
        "admyrin": "brand",
        "fashion eva": "brand",
        "kurti's": "brand",
        "rama's": "brand",
        "f loop": "brand",
        "patola": "brand",
        "kalki fashion": "brand",
        "shelina": "brand",
        "crazora": "brand",
        "vbuyz": "brand",
        "varkha fashion": "brand",
        "gili": "brand",
        "aairah": "brand",
        "the bebo": "brand",
        "color kathaa": "brand",
        "mouvari": "brand",
        "jugnu": "brand",
        "tami": "brand",
        "ankahi": "brand",
        "aana": "brand",
        "janasya": "brand",
        "lingra": "brand",
        "manvaa": "brand",
        "mmantra": "brand",
        "vedikas": "brand",
        "haute 5": "brand",
        "aasvaa": "brand",
        "sourbh sarees": "brand",
        "blissta": "brand",
        "vida": "brand",
        "desi firangee": "brand",
        "kashish by shoppers stop": "brand",
        "fab 9": "brand",
        "sohniye": "brand",
        "lovely look": "brand",
        "alzara": "brand",
        "hola": "brand",
        "neerus": "brand",
        "parisha": "brand",
        "kalista": "brand",
        "pagazo": "brand",
        "xora": "brand",
        "stylenmart": "brand",
        "decot": "brand",
        "aayusika": "brand",
        "jainish": "brand",
        "vasudha": "brand",
        "inara robes": "brand",
        "biba-outlet": "brand",
        "sakhi sang": "brand",
        "atulya": "brand",
        "indidori": "brand",
        "krishtii": "brand",
        "fasense": "brand",
        "aabroo": "brand",
        "apple creation": "brand",
        "nanni": "brand",
        "soundarya": "brand",
        "karigari": "brand",
        "eternal": "brand",
        "triveni sarees": "brand",
        "golmaal": "brand",
        "present": "brand",
        "peppertree": "brand",
        "glam quotient": "brand",
        "scarves & glitters": "brand",
        "alma": "brand",
        "q answers": "brand",
        "krishti": "brand",
        "nikhaar": "brand",
        "navyou": "brand",
        "sia": "brand",
        "sarvinis": "brand",
        "dc": "brand",
        "boltio": "brand",
        "cole haan": "brand",
        "lotto": "brand",
        "sparx": "brand",
        "angry birds": "brand",
        "north star": "brand",
        "dearfoams": "brand",
        "asics tiger": "brand",
        "arugam bay": "brand",
        "vostro": "brand",
        "rex": "brand",
        "kelme": "brand",
        "escan": "brand",
        "scentra": "brand",
        "torrini": "brand",
        "saashiwear": "brand",
        "pellini": "brand",
        "panahi": "brand",
        "frestol": "brand",
        "real blue": "brand",
        "walkland": "brand",
        "ta chic": "brand",
        "flipside": "brand",
        "mod squad": "brand",
        "power": "brand",
        "ipanema": "brand",
        "mossimo": "brand",
        "spinn": "brand",
        "sole threads": "brand",
        "olvin": "brand",
        "yo! jelo!": "brand",
        "vinenzia": "brand",
        "mtv": "brand",
        "woo": "brand",
        "freetoes": "brand",
        "ella": "brand",
        "fizik freak": "brand",
        "grendha": "brand",
        "ezra": "brand",
        "pieces": "brand",
        "funkytown": "brand",
        "kiale": "brand",
        "ara": "brand",
        "naona": "brand",
        "k22": "brand",
        "sant": "brand",
        "zign": "brand",
        "zuicy": "brand",
        "coral haze": "brand",
        "shubhangini fashion": "brand",
        "spink": "brand",
        "sher singh": "brand",
        "salt": "brand",
        "strings": "brand",
        "aurika": "brand",
        "paper dolls": "brand",
        "penny": "brand",
        "arrow new york": "brand",
        "hue by anamika": "brand",
        "monica dogra for stylista": "brand",
        "little mistress": "brand",
        "wills signature": "brand",
        "rinku dalamal for stylista": "brand",
        "girls on film": "brand",
        "casual collection": "brand",
        "preggear": "brand",
        "tonga": "brand",
        "triveni": "brand",
        "color fuel": "brand",
        "kodz": "brand",
        "lipsy": "brand",
        "altamoss": "brand",
        "chemistry": "brand",
        "xniva": "brand",
        "purple turtle": "brand",
        "goddess women": "brand",
        "oomph!": "brand",
        "saree exotica": "brand",
        "bollydiva by tops and tunics": "brand",
        "being fab": "brand",
        "khwaab": "brand",
        "nirosha": "brand",
        "slip-on": "closure",
        "zip fly": "closure",
        "button fly": "closure",
        "elasticated": "closure",
        "button": "closure",
        "zip-fly": "closure",
        "zip": "closure",
        "2-button": "closure",
        "zipper": "closure",
        "fly": "closure",
        "flybutton": "closure",
        "buttoned": "closure",
        "no closure": "closure",
        "snap button": "closure",
        "hook and eye": "closure",
        "toggle": "closure",
        "twist clasp": "closure",
        "push lock": "closure",
        "buckle": "closure",
        "drawstring": "closure",
        "velcro": "closure",
        "lock": "closure",
        "magnet": "closure",
        "snap": "closure",
        "flap": "closure",
        "loop": "closure",
        "clasp": "closure",
        "dori": "closure",
        "open": "closure",
        "black": "colour",
        "off white": "colour",
        "grey": "colour",
        "maroon": "colour",
        "olive": "colour",
        "grey melange": "colour",
        "pink": "colour",
        "white": "colour",
        "red": "colour",
        "green": "colour",
        "blue": "colour",
        "beige": "colour",
        "brown": "colour",
        "charcoal": "colour",
        "cream": "colour",
        "navy blue": "colour",
        "purple": "colour",
        "burgundy": "colour",
        "rust": "colour",
        "coral": "colour",
        "yellow": "colour",
        "fluorescent green": "colour",
        "orange": "colour",
        "peach": "colour",
        "teal": "colour",
        "magenta": "colour",
        "sea green": "colour",
        "mauve": "colour",
        "taupe": "colour",
        "multi": "colour",
        "turquoise blue": "colour",
        "lime green": "colour",
        "lavender": "colour",
        "mustard yellow": "colour",
        "aqua blue": "colour",
        "wine": "colour",
        "lemon": "colour",
        "dark grey": "colour",
        "multicoloured": "colour",
        "grey milange": "colour",
        "charcoal grey": "colour",
        "light blue": "colour",
        "light grey": "colour",
        "silver": "colour",
        "fuchsia": "colour",
        "coffee": "colour",
        "lilac": "colour",
        "golden": "colour",
        "turquoise": "colour",
        "camel": "colour",
        "nude": "colour",
        "khaki": "colour",
        "aqua": "colour",
        "firozi": "colour",
        "ice blue": "colour",
        "ivory": "colour",
        "violet indigo": "colour",
        "gold": "colour",
        "bronze": "colour",
        "rose": "colour",
        "skin": "colour",
        "tan": "colour",
        "copper": "colour",
        "coffee brown": "colour",
        "mushroom brown": "colour",
        "cobalt blue": "colour",
        "milange": "colour",
        "metal": "colour",
        "camel shade": "colour",
        "two tone": "colour",
        "cherry": "colour",
        "champagne": "colour",
        "cognac": "colour",
        "metallic": "colour",
        "antique gold": "colour",
        "apricot": "colour",
        "brick red": "colour",
        "assorted": "colour",
        "sand": "colour",
        "ash": "colour",
        "neutral": "colour",
        "rani": "colour",
        "antique silver": "colour",
        "steel grey": "colour",
        "no fade": "denim_fade",
        "light fade": "denim_fade",
        "heavy fade": "denim_fade",
        "dark": "denim_shade",
        "medium": "denim_shade",
        "light": "denim_shade",
        "coloured": "denim_shade",
        "layered": "surface_styling",
        "panelled": "design_styling",
        "high slit": "design_styling",
        "pleated": "design_styling",
        "empire": "design_styling",
        "tiered": "design_styling",
        "angrakha": "design_styling",
        "front open": "design_styling",
        "casual wear": "display_categories",
        "sports wear": "display_categories",
        "whiskers and chevrons": "effects",
        "honeycomb": "effects",
        "viscose": "fabric",
        "modal": "fabric",
        "nylon": "fabric",
        "elastane": "fabric",
        "linen": "fabric",
        "blended": "fabric",
        "synthetic": "fabric",
        "cashmere": "fabric",
        "cotton spandex (stretchable)": "fabric",
        "lyocell": "fabric",
        "100% polyester": "fabric",
        "cotton polyester": "fabric",
        "viscose blend": "fabric",
        "polyester viscose": "fabric",
        "acrylic": "fabric",
        "80% polyester,20%elastane": "fabric",
        "cotton blend": "fabric",
        "polyester spandex(stretchable)": "fabric",
        "cotton modal": "fabric",
        "polyester nylon": "fabric",
        "65%polyester 35%viscose": "fabric",
        "poly cotton": "fabric",
        "georgette": "fabric",
        "viscose spandex(stretchable)": "fabric",
        "viscose spandex": "fabric",
        "100% cotton": "fabric",
        "65%polyester,35%cotton": "fabric",
        "95%cotton 5%spandex(stretchable)": "fabric",
        "70% polyester,30%cotton": "fabric",
        "wool": "fabric",
        "80% cotton,20% polyester": "fabric",
        "cotton jersey": "fabric",
        "jersey": "fabric",
        "60% polyester,40% cotton": "fabric",
        "95% cotton,5% spandex": "fabric",
        "crepe": "fabric",
        "70% polyester,30%elastane": "fabric",
        "60% cotton,40% polyester": "fabric",
        "polyester cotton": "fabric",
        "polyester spandex": "fabric",
        "viscose jersy": "fabric",
        "cotton knit": "fabric",
        "100% viscose": "fabric",
        "polyester viscose spandex(stretchable)": "fabric",
        "70% cotton,30% polyester": "fabric",
        "90%polyester 10%spandex(stretchable)": "fabric",
        "cotton poly": "fabric",
        "poly georgette": "fabric",
        "denim": "fabric",
        "50%cotton 50%polyester": "fabric",
        "cotton poly spandex": "fabric",
        "fleece": "fabric",
        "knit": "fabric",
        "cotton rayon": "fabric",
        "rayon spandex(stretchable)": "fabric",
        "poly": "fabric",
        "net": "fabric",
        "cotton viscose": "fabric",
        "50% polyester,25% cotton,25% rayon": "fabric",
        "poly viscose": "fabric",
        "viscose lycra": "fabric",
        "polyester crepe": "fabric",
        "jersy": "fabric",
        "khadi cotton": "fabric",
        "98% cotton 2% spandex": "fabric",
        "50% cotton 50% viscose": "fabric",
        "44% modal,42% cotton,14% nylon": "fabric",
        "87% nylon + 13% lycra(elastane)": "fabric",
        "90%cotton 10%spandex(stretchable)": "fabric",
        "acrylic blend": "fabric",
        "84% polyamide,16% elastane": "fabric",
        "silk": "fabric",
        "polyamide spandex(stretchable)": "fabric",
        "chiffon": "fabric",
        "poly crepe": "fabric",
        "100% acrylic": "fabric",
        "cottonpoly spandex(stretchable)": "fabric",
        "rayon blend": "fabric",
        "jute": "fabric",
        "95%viscose 5%spandex(stretchable)": "fabric",
        "cotton spandex": "fabric",
        "cotton fleece": "fabric",
        "modal blend": "fabric",
        "cotton linen": "fabric",
        "95/5 cotton lycra": "fabric",
        "polycotton spandex(stretchable)": "fabric",
        "poly linen": "fabric",
        "linen blend": "fabric",
        "organic cotton": "fabric",
        "linen cotton": "fabric",
        "48% polyester,48% viscose,4% elastane": "fabric",
        "92%cotton 8%spandex(stretchable)": "fabric",
        "silk blend": "fabric",
        "nylon lycra": "fabric",
        "cambric": "fabric",
        "89%polyester 11%spandex(stretchable)": "fabric",
        "95% polyester 5%spandex": "fabric",
        "satin": "fabric",
        "90%cotton3%polyester": "fabric",
        "50% polyester,25% viscose,25% cotton": "fabric",
        "96%polyester 4%spandex(stretchable)": "fabric",
        "cotton satin spandex(stretchable)": "fabric",
        "polyamide": "fabric",
        "viscose modal": "fabric",
        "wool blend": "fabric",
        "polyamide spandex": "fabric",
        "pu": "fabric",
        "viscose/rayon": "fabric",
        "ramie": "fabric",
        "bamboo": "fabric",
        "poly chiffon": "fabric",
        "nylon spandex": "fabric",
        "lace": "fabric",
        "cotton silk": "fabric",
        "92/8 viscose lycra": "fabric",
        "poly satin": "fabric",
        "nylon spandex(stretchable)": "fabric",
        "crepe jersey": "fabric",
        "suede": "fabric",
        "poly silk": "fabric",
        "gorgette": "fabric",
        "polyknit spandex(stretchable)": "fabric",
        "melange": "fabric",
        "polyster mesh": "fabric",
        "jacquard": "fabric",
        "poly nylon": "fabric",
        "jaquard": "fabric",
        "poplin": "fabric",
        "50% rayon,40% polyester,10% spandex": "fabric",
        "95%polyester 5%spandex(stretchable)": "fabric",
        "100% nylon": "fabric",
        "polyamide blend": "fabric",
        "polyester silk": "fabric",
        "velvet": "fabric",
        "flex": "fabric",
        "cotton satin": "fabric",
        "100% modal": "fabric",
        "dobby": "fabric",
        "net and brasso": "fabric",
        "tencel": "fabric",
        "shantoon": "fabric",
        "polyester satin": "fabric",
        "poly viscose elastane": "fabric",
        "mesh": "fabric",
        "100% cashmere": "fabric",
        "brasso": "fabric",
        "micro": "fabric",
        "cotton voile": "fabric",
        "net brasso": "fabric",
        "100% linen": "fabric",
        "elastane(stretchable)": "fabric",
        "nylon & cotton": "fabric",
        "leather": "fabric",
        "53%viscose 47%rayon": "fabric",
        "cotton lurex": "fabric",
        "dupion silk": "fabric",
        "crochet": "fabric",
        "polyester lycra": "fabric",
        "schiffli": "fabric",
        "pique": "fabric",
        "cotton 60% acrylic 40%": "fabric",
        "swiss voile": "fabric",
        "rayon polyester": "fabric",
        "light polyester": "fabric",
        "organza": "fabric",
        "100% cotton poplin": "fabric",
        "twill": "fabric",
        "flannel": "fabric",
        "crepe silk": "fabric",
        "chanderi": "fabric",
        "cotton lawn": "fabric",
        "poly dupion": "fabric",
        "chambrey": "fabric",
        "50% recycled polyester,50% polyester": "fabric",
        "poly viscose nylon": "fabric",
        "80%polyester 20%cotton": "fabric",
        "brocade": "fabric",
        "crepe blend": "fabric",
        "tussar": "fabric",
        "net and chiffon": "fabric",
        "terelene spandex": "fabric",
        "96%viscose 4%spandex(stretchable)": "fabric",
        "georgette crepe": "fabric",
        "net and georgette": "fabric",
        "acrylic wool": "fabric",
        "cotton polyamide spandex(stretchable)": "fabric",
        "terry rayon": "fabric",
        "raw silk": "fabric",
        "organic cotton spandex": "fabric",
        "60% polyester,40% nylon": "fabric",
        "excel": "fabric",
        "acrowool": "fabric",
        "terelene": "fabric",
        "sequins fabric": "fabric",
        "80% cotton, 20% polyester": "fabric",
        "cotton stretch": "fabric",
        "stretch": "fabric",
        "denim spandex (stretchable)": "fabric",
        "twill lycra": "fabric",
        "corduroy": "fabric",
        "canvas": "fabric",
        "terelyne rayon": "fabric",
        "chanderi cotton": "fabric",
        "chanderi silk": "fabric",
        "voile": "fabric",
        "jute silk": "fabric",
        "art silk": "fabric",
        "100% pashmina": "fabric",
        "artificial silk": "fabric",
        "woolen": "fabric",
        "tussar silk": "fabric",
        "woven": "fabric",
        "georgette brocade": "fabric",
        "100% wool": "fabric",
        "mulmul": "fabric",
        "cotton rich": "fabric",
        "bhagalpuri silk": "fabric",
        "50% cotton,30% rayon,20% polyester": "fabric",
        "super net": "fabric",
        "synthetic stretch": "fabric",
        "tafetta": "fabric",
        "banarasi": "fabric",
        "silk georgette": "fabric",
        "beads": "fabric",
        "shimmer": "fabric",
        "acetate blend": "fabric",
        "bemberg": "fabric",
        "polyurethane": "fabric",
        "viscose jacquard": "fabric",
        "acetate": "fabric",
        "terelene spandex(stretchable)": "fabric",
        "fabric": "fabric",
        "cotton satin spandex": "fabric",
        "net and  georgette": "fabric",
        "pure": "fabric_purity",
        "apparel": "fashion_category",
        "footwear": "fashion_category",
        "free items": "fashion_category",
        "fashion": "fashion_type",
        "core": "fashion_type",
        "waist belt / tie-ups": "feature",
        "gathers / pleats": "feature",
        "layered / tiered": "feature",
        "sequins / embellishments": "feature",
        "sheer": "transparency",
        "ruffles": "feature",
        "cut-outs": "feature",
        "shimmer / sheen": "feature",
        "smocking": "feature",
        "fringes": "feature",
        "chest pocket": "feature",
        "pack of 2 t shirts": "feature",
        "1 top": "feature",
        "top": "feature",
        "pack of 2 tops": "feature",
        "1 tops": "feature",
        "1 tunic": "feature",
        "pack of 3": "feature",
        "1 t-shirt": "feature",
        "pack of 2": "feature",
        "pack of 1": "feature",
        "women's designer top": "feature",
        "pack of 2 top": "feature",
        "top with inner": "feature",
        "3 tank top": "feature",
        "one pair of stocking": "feature",
        "1 tube top": "feature",
        "vi704wa": "feature",
        "pack of 2 tank tops": "feature",
        "off white coloured printed blouse": "feature",
        "beige coloured printed blouse": "feature",
        "2 tops": "feature",
        "stripe top": "feature",
        "solid top": "feature",
        "multi coloured printed blouse": "feature",
        "3 tops": "feature",
        "printed top": "feature",
        "1 shirt": "feature",
        "1 tshirt": "feature",
        "shirt": "type",
        "one top": "feature",
        "blue coloured printed blouse": "feature",
        "women": "gender",
        "2 tshirt": "feature",
        "top with lining": "feature",
        "crop top": "feature",
        "crop top with palazzo": "feature",
        "top with skirt": "feature",
        "top with neck prob": "feature",
        "1top": "feature",
        "shrug": "feature",
        "dress with ribbon belt & top": "feature",
        "top (pack of 2)": "feature",
        "1  top": "feature",
        "top & tank": "feature",
        "pack of 2 tube top": "feature",
        "1 tank top": "feature",
        "dress with belt": "feature",
        "1 women top": "feature",
        "be797wabft2067": "feature",
        "pack of 2 pretty sleeve top": "feature",
        "tunic": "feature",
        "pack of 3 camisoles": "feature",
        "1 sweater": "feature",
        "top and shrug": "feature",
        "pack of 3 tops": "feature",
        "women round neck printed cotton tops-pack of 5": "feature",
        "1 blouse": "feature",
        "embellished top": "feature",
        "shirt with inner": "feature",
        "top with palazzo": "feature",
        "top with skirts": "feature",
        "black coloured solid blouse": "feature",
        "crop top with tube top": "feature",
        "blouse with belt": "feature",
        "top & belt": "feature",
        "blue coloured solid blouse": "feature",
        "kurti": "feature",
        "kurta with lining": "feature",
        "ggnpc": "feature",
        "top with tucks": "feature",
        "top with belt": "feature",
        "top with tunic": "feature",
        "top with shirt": "feature",
        "1 kaftan": "feature",
        "pack of 2 tube tops": "feature",
        "top & tube": "feature",
        "top with blouse": "feature",
        "1 top 1 shorts": "feature",
        "set of 4 top": "feature",
        "top with spaghetti": "feature",
        "top, dupatta": "feature",
        "1 t-shirt 1 pyjama": "feature",
        "top & inner": "feature",
        "crepe top with belt": "feature",
        "1 women tunic": "feature",
        "pyjama set": "feature",
        "one tank top": "feature",
        "grey cotton multi floral top": "feature",
        "1 shis": "feature",
        "1 t-shirt 1 shorts": "feature",
        "pack of a spaghetti top": "feature",
        "twin fabric top": "feature",
        "1 t shirt": "feature",
        "1 top with 1 skirt": "feature",
        "top with chain": "feature",
        "tunic with belt": "feature",
        "1 dress": "feature",
        "crop top and skirt": "feature",
        "t shirts with chain": "feature",
        "1 top and 1 skirt": "feature",
        "top with scarf": "feature",
        "top with pant": "feature",
        "blouse with lining": "feature",
        "dress with lining": "feature",
        "crop top with skirt": "feature",
        "1 top with 1 palazoo": "feature",
        "salwar kameez dupatta": "feature",
        "blouse with lininig": "feature",
        "kurta pants set": "feature",
        "1 top & 1 skirt": "feature",
        "jc169wa": "feature",
        "ritzzy set of 2 jackets": "feature",
        "tunic with necklace": "feature",
        "pa830wa": "feature",
        "shirt with belt": "feature",
        "trend top with palazzo pant and dupatta": "feature",
        "top with shorts": "feature",
        "black top with inner": "feature",
        "top & skirt": "feature",
        "pack of 3 top": "feature",
        "long sleeve lace top": "feature",
        "jacket with belt": "feature",
        "pack of 2 shirt": "feature",
        "top, skirt": "feature",
        "pc": "feature",
        "top and kafatn": "feature",
        "navy lace contrast lined top": "feature",
        "1 top 1 pyjama": "feature",
        "tops with lining": "feature",
        "top and shorts": "feature",
        "top and leggings": "feature",
        "kurta with jacket": "feature",
        "top with stole": "feature",
        "coated": "feature",
        "applique and patchwork": "feature",
        "zipper detailing": "feature",
        "acid wash": "feature",
        "embellished": "feature",
        "ombre": "pattern_type",
        "washed": "pattern_type",
        "self pattern": "pattern",
        "striped": "pattern",
        "checked": "pattern",
        "insulator": "feature",
        "windcheater": "feature",
        "lightweight": "feature",
        "reversible": "feature",
        "water resistant": "feature",
        "asymmetric closure": "feature",
        "windcheater and water resistant": "feature",
        "reflective": "feature",
        "tie-ups": "surface_styling",
        "lace inserts": "surface_styling",
        "gathered or pleated": "surface_styling",
        "bow": "surface_styling",
        "sheen": "surface_styling",
        "smocked": "surface_styling",
        "leather or faux leather trim": "surface_styling",
        "applique": "surface_styling",
        "boxy": "fit",
        "compression": "fit",
        "straight": "type",
        "fitted and flared": "fit",
        "flared": "hemline",
        "bootcut": "fit",
        "boyfriend fit": "fit",
        "jogger": "fit",
        "unisex": "gender",
        "female": "gender",
        "girls": "gender",
        "boys": "gender",
        "men": "gender",
        "unlined": "lining",
        "faux fur": "lining",
        "non leather": "lining",
        "croslite": "lining",
        "ccilucell": "lining",
        "rubber like (eva)": "lining",
        "straight hem": "hemline",
        "ribbed hem": "hemline",
        "curved": "hemline",
        "hem with toggle": "hemline",
        "high-low": "hemline",
        "asymmetric": "neck",
        "scalloped": "hemline",
        "high low": "hemline",
        "hooded": "hood",
        "detachable hood": "hood",
        "Hip Length": "length",
        "Waist Length": "length",
        "Thigh Length": "length",
        "Full Length": "length",
        "Cropped Length": "length",
        "Knee Length": "length",
        "Short": "length",
        "Mini": "length",
        "Maxi": "length",
        "Calf Length": "length",
        "Mid-Thigh Length": "length",
        "MINI": "length",
        "Regular Length Socks": "length",
        "29 Inches": "length",
        "Maxi/Long": "length",
        "Midi": "length",
        "Mini/Short": "length",
        "Bustier": "length",
        "Ankle Length": "length",
        "cropped length": "length",
        "ankle length": "length",
        "full length": "length",
        "short": "length",
        "hip length": "length",
        "3/4th length": "length",
        "mini": "length",
        "calf length": "length",
        "29 inches": "length",
        "longline": "length",
        "crop": "length",
        "thigh length": "length",
        "waist length": "length",
        "knee length": "length",
        "midi": "length",
        "above knee": "length",
        "mid-thigh length": "length",
        "midi/calf length": "length",
        "42 inches": "length",
        "knee-length": "length",
        "mini/short": "length",
        "34 inches": "length",
        "maxi/long": "length",
        "v-neck": "neck",
        "round neck": "neck",
        "turtle mock or roll": "neck",
        "high neck": "neck",
        "henley neck": "neck",
        "polo collar": "neck",
        "scoop neck": "neck",
        "boat neck": "neck",
        "mandarin / chinese collar": "neck",
        "hood": "neck",
        "peter pan collar": "neck",
        "cowl neck": "neck",
        "racerback": "neck",
        "v neck": "neck",
        "henley": "type",
        "off shoulder": "neck",
        "one shoulder": "neck",
        "halter neck": "neck",
        "shoulder strap": "neck",
        "square neck": "neck",
        "shawl neck": "neck",
        "u neck": "neck",
        "spaghetti neck": "neck",
        "polo neck": "neck",
        "collar": "neck",
        "keyhole neck": "neck",
        "turtle neck": "neck",
        "round": "neck",
        "sweetheart neck": "neck",
        "crew neck": "neck",
        "shawl collar": "neck",
        "lapel collar": "neck",
        "notch collar": "neck",
        "nehru collar": "neck",
        "bow neck": "neck",
        "band collar": "neck",
        "square": "neck",
        "button down": "neck",
        "bow tie neck": "neck",
        "stand collar": "neck",
        "mock collar": "neck",
        "spread collar": "neck",
        "collarless": "neck",
        "open collar": "neck",
        "double collar": "neck",
        "shirt collar": "neck",
        "kimono": "neck",
        "straight collar": "neck",
        "off-shoulder": "neck",
        "key hole neckline": "neck",
        "strapless or tube": "neck",
        "6 and more": "number_of_pockets",
        "five": "number_of_pockets",
        "5-pocket": "number_of_pockets",
        "multiple": "number_of_pockets",
        "zippered": "number_of_pockets",
        "4-pocket": "number_of_pockets",
        "five-pocket": "number_of_pockets",
        "front": "number_of_pockets",
        "back": "number_of_pockets",
        "design5-pocket": "number_of_pockets",
        "traditional": "number_of_pockets",
        "fabric5": "number_of_pockets",
        "twin": "number_of_pockets",
        "belt5-pocket": "number_of_pockets",
        "two": "number_of_pockets",
        "coin": "number_of_pockets",
        "stylish": "number_of_pockets",
        "welt": "number_of_pockets",
        "heels.5-pocket": "number_of_pockets",
        "four-pocket": "number_of_pockets",
        "fabric5-pocket": "number_of_pockets",
        "functional": "number_of_pockets",
        "featuring": "number_of_pockets",
        "classic-5": "number_of_pockets",
        "insert": "number_of_pockets",
        "smart casual": "usage",
        "faux fur trim": "ornamentation",
        "shoulder tabs": "ornamentation",
        "zip detail": "ornamentation",
        "mock leather trim": "ornamentation",
        "studded": "ornamentation",
        "patches": "ornamentation",
        "rivets": "ornamentation",
        "sequinned": "ornamentation",
        "embriodered": "ornamentation",
        "western - embellished": "ornamentation",
        "bows": "ornamentation",
        "buckles": "ornamentation",
        "laser cuts": "ornamentation",
        "ethnic - embellished": "ornamentation",
        "tassels": "ornamentation",
        "quilted": "ornamentation",
        "fringed": "ornamentation",
        "no ornamentation": "ornamentation_type",
        "cut work": "ornamentation",
        "buckle detail": "ornamentation",
        "tasseled": "ornamentation",
        "bow detail": "ornamentation",
        "zari work": "ornamentation_type",
        "mirror work": "ornamentation_type",
        "sequins": "ornamentation_type",
        "thread work": "ornamentation_type",
        "beads and stones": "ornamentation_type",
        "zardozi": "ornamentation_type",
        "mukaish": "ornamentation_type",
        "gotta patti": "ornamentation_type",
        "zari border": "ornamentation_type",
        "patchwork": "ornamentation_type",
        "aari work": "ornamentation_type",
        "chikankari": "ornamentation_type",
        "phulkari": "ornamentation_type",
        "kantha work": "ornamentation_type",
        "small": "pattern_coverage",
        "placement": "pattern_coverage",
        "yoke or border": "pattern_coverage",
        "large": "pattern_coverage",
        "solid and plain": "pattern_type",
        "typography": "pattern_type",
        "geometric": "pattern",
        "floral and tropical": "pattern_type",
        "conversational prints": "pattern_type",
        "abstract and digital": "pattern_type",
        "varsity": "pattern_type",
        "biker": "pattern_type",
        "humour and comic": "pattern_type",
        "superhero": "pattern_type",
        "people and places": "pattern_type",
        "camouflage and animalskin print": "pattern_type",
        "polka dots": "pattern_type",
        "tribal and aztec": "pattern_type",
        "tie dye and batik": "pattern_type",
        "music": "pattern_type",
        "sports and team jersey": "pattern_type",
        "Others": "pattern_type",
        "Animal print": "pattern_type",
        "Tie and dye": "pattern_type",
        "Floral or Tropical": "pattern_type",
        "Aztec": "pattern_type",
        "Abstract": "pattern_type",
        "Geometric": "pattern_type",
        "Polka Dots": "pattern_type",
        "Ombre": "pattern_type",
        "Graphic": "pattern_type",
        "abstract": "pattern_type",
        "floral": "pattern_type",
        "graphic": "pattern_type",
        "camouflage": "pattern_type",
        "aztec": "pattern_type",
        "animal": "pattern_type",
        "polka dot": "pattern_type",
        "ethnic motifs": "pattern_type",
        "alphanumeric": "pattern_type",
        "conversational": "pattern_type",
        "tribal": "pattern_type",
        "tropical": "pattern_type",
        "bohemian or global": "pattern_type",
        "tie dye and ombre": "pattern_type",
        "comic": "pattern_type",
        "colour blocked": "pattern",
        "self design": "pattern",
        "print": "pattern",
        "brand print": "pattern",
        "text print": "pattern",
        "landscape-highlight-text print": "pattern",
        "highlight-graphic print": "pattern",
        "camouflage print": "pattern",
        "abstract print": "pattern",
        "sublimation print": "pattern",
        "rubber print": "pattern",
        "logo print": "pattern",
        "graphic print": "pattern",
        "contrast print": "pattern",
        "fantastic print": "pattern",
        "message print": "pattern",
        "scribble print": "pattern",
        "geometric print": "pattern",
        "a print": "pattern",
        "jack print": "pattern",
        "floral print": "pattern",
        "cool print": "pattern",
        "quotes print": "pattern",
        "workout print": "pattern",
        "highlight print": "pattern",
        "number print": "pattern",
        "bravo print": "pattern",
        "stylish print": "pattern",
        "highlight-text print": "pattern",
        "contemporary print": "pattern",
        "arrow print": "pattern",
        "slogan print": "pattern",
        "leafy print": "pattern",
        "floral-leafy print": "pattern",
        "name print": "pattern",
        "trendy print": "pattern",
        "triangular print": "pattern",
        "word print": "pattern",
        "doted print": "pattern",
        "graphic-text print": "pattern",
        "eye-catching print": "pattern",
        "block print": "pattern",
        "features print": "pattern",
        "plastic print": "pattern",
        "om print": "pattern",
        "placement print": "pattern",
        "epic print": "pattern",
        "funky print": "pattern",
        "you print": "pattern",
        "camp print": "pattern",
        "quirky print": "pattern",
        "bravo-theme print": "pattern",
        "digital print": "pattern",
        "contrasting print": "pattern",
        "paisley print": "pattern",
        "bravo? print": "pattern",
        "subtle print": "pattern",
        "initials print": "pattern",
        "logo-graphic print": "pattern",
        "chic print": "pattern",
        "beach print": "pattern",
        "front print": "pattern",
        "attractive print": "pattern",
        "animal print": "pattern",
        "?london? print": "pattern",
        "imperfect? print": "pattern",
        "interesting print": "pattern",
        "swoosh print": "pattern",
        "eyes? print": "pattern",
        "lips print": "pattern",
        "colourful print": "pattern",
        "laboratory-theme print": "pattern",
        "minimal print": "pattern",
        "skyline print": "pattern",
        "star print": "pattern",
        "bandhani print": "pattern",
        "multicoloured print": "pattern",
        "accessory print": "pattern",
        "?benetton? print": "pattern",
        "pocket-graphic print": "pattern",
        "appealing print": "pattern",
        "shibori print": "pattern",
        "yay print": "pattern",
        "highlight-leafy print": "pattern",
        "madness print": "pattern",
        "origami print": "pattern",
        "ethnic print": "pattern",
        "and print": "pattern",
        "with print": "pattern",
        "striking print": "pattern",
        "effect print": "pattern",
        "fitness-motif print": "pattern",
        "crossfit print": "pattern",
        "highlight-photograph print": "pattern",
        "bird print": "pattern",
        "golden print": "pattern",
        "allover print": "pattern",
        "stripe print": "pattern",
        "tribal print": "pattern",
        "art print": "pattern",
        "traditional print": "pattern",
        "bravographic print": "pattern",
        "whacky print": "pattern",
        "studio? print": "pattern",
        "naps! print": "pattern",
        "yoga-theme print": "pattern",
        "camo print": "pattern",
        "dog print": "pattern",
        "division? print": "pattern",
        "unexpected print": "pattern",
        "hockey? print": "pattern",
        "vibrant print": "pattern",
        "over print": "pattern",
        "alluring print": "pattern",
        "butterfly print": "pattern",
        "voguish print": "pattern",
        "soul? print": "pattern",
        "shiny print": "pattern",
        "wild print": "pattern",
        "3d print": "pattern",
        "face print": "pattern",
        "batik print": "pattern",
        "graffiti print": "pattern",
        "apple print": "pattern",
        "batman print": "pattern",
        "alphabetical print": "pattern",
        "catchy print": "pattern",
        "alphabet print": "pattern",
        "bud print": "pattern",
        "cat print": "pattern",
        "modern print": "pattern",
        "chevron print": "pattern",
        "pineapple print": "pattern",
        "chest print": "pattern",
        "the print": "pattern",
        "pinstriped print": "pattern",
        "graphic-logo print": "pattern",
        "charming print": "pattern",
        "splatter print": "pattern",
        "10013 print": "pattern",
        "screen print": "pattern",
        "foil print": "pattern",
        "numerical print": "pattern",
        "anchor-text print": "pattern",
        "cartoon print": "pattern",
        "pisa? print": "pattern",
        "scenery print": "pattern",
        "guy-theme print": "pattern",
        "love? print": "pattern",
        "buttons? print": "pattern",
        "gang? print": "pattern",
        "simpsons-theme print": "pattern",
        "simpson print": "pattern",
        "convenient? print": "pattern",
        "tropical-highlight print": "pattern",
        "ikat print": "pattern",
        "heart print": "pattern",
        "rubber-graphic print": "pattern",
        "kola print": "pattern",
        "dye print": "pattern",
        "paris print": "pattern",
        "highlight-shoe print": "pattern",
        "london? print": "pattern",
        "creative print": "pattern",
        "coloured print": "pattern",
        "amazing print": "pattern",
        "lipstick print": "pattern",
        "captivating print": "pattern",
        "striped print": "pattern",
        "dreamy print": "pattern",
        "anchor print": "pattern",
        "owl print": "pattern",
        "beer? print": "pattern",
        "text-photograph print": "pattern",
        "forest print": "pattern",
        "floral-message print": "pattern",
        "play print": "pattern",
        "unique print": "pattern",
        "crane print": "pattern",
        "snakeskin print": "pattern",
        "flora-fauna print": "pattern",
        "ombre print": "pattern",
        "crystal print": "pattern",
        "cute print": "pattern",
        "leopard print": "pattern",
        "rave print": "pattern",
        "biker print": "pattern",
        "lace / crochet": "pattern",
        "printed|striped": "pattern",
        "elasticated|printed": "pattern",
        "life-inspired print": "pattern",
        "tie-dye print": "pattern",
        "trim print": "pattern",
        "houndstooth print": "pattern",
        "dabu print": "pattern",
        "elephant print": "pattern",
        "leaf print": "pattern",
        "white print": "pattern",
        "textured": "pattern",
        "paisley": "pattern",
        "aztec or tribal": "pattern",
        "check": "pattern",
        "quirky": "pattern",
        "stripe": "pattern",
        "abstract & digital": "pattern",
        "leheriya print": "pattern",
        "zig zag / chevron": "pattern",
        "bandhni print": "pattern",
        "plaid print": "pattern",
        "triangle print": "pattern",
        "geometric-contemporary print": "pattern",
        "antique print": "pattern",
        "panel print": "pattern",
        "indigo print": "pattern",
        "elephant-floral-deer print": "pattern",
        "floral-leafy-bird print": "pattern",
        "contemporary-floral-abstract print": "pattern",
        "check print": "pattern",
        "floral-deer print": "pattern",
        "geometric-floral-contemporary print": "pattern",
        "exquisite print": "pattern",
        "gold print": "pattern",
        "detailing-block print": "pattern",
        "floral-inspired print": "pattern",
        "all-over print": "pattern",
        "kalamkari print": "pattern",
        "enticing print": "pattern",
        "border print": "pattern",
        "floral-block print": "pattern",
        "khari print": "pattern",
        "beautiful print": "pattern",
        "multiple print": "pattern",
        "stilettos.floral-inspired print": "pattern",
        "tile print": "pattern",
        "hand-block print": "pattern",
        "dainty print": "pattern",
        "faded print": "pattern",
        "match print": "pattern",
        "mandala print": "pattern",
        "eye print": "pattern",
        "embossed print": "pattern",
        "butti print": "pattern",
        "handblock print": "pattern",
        "red print": "pattern",
        "floral-heart-paisley print": "pattern",
        "ethnic-inspired print": "pattern",
        "bagh print": "pattern",
        "stereo print": "pattern",
        "geographic print": "pattern",
        "modern-theme print": "pattern",
        "art? print": "pattern",
        "zigzag print": "pattern",
        "camel print": "pattern",
        "tiny print": "pattern",
        "two-tone print": "pattern",
        "block-abstract print": "pattern",
        "colour print": "pattern",
        "bold print": "pattern",
        "pinstripe print": "pattern",
        "inspired print": "pattern",
        "ethnic-motif print": "pattern",
        "horse print": "pattern",
        "recorder print": "pattern",
        "black print": "pattern",
        "dhar print": "pattern",
        "bagru print": "pattern",
        "vintage print": "pattern",
        "building print": "pattern",
        "key print": "pattern",
        "landscape print": "pattern",
        "aztec print": "pattern",
        "yacht print": "pattern",
        "inside-out print": "pattern",
        "embroidered print": "pattern",
        "machine print": "pattern",
        "bock print": "pattern",
        "tropical print": "pattern",
        "dot-face print": "pattern",
        "floral-abstract print": "pattern",
        "baroque print": "pattern",
        "wave print": "pattern",
        "kashmiri print": "pattern",
        "?cacti? print": "pattern",
        "featuring print": "pattern",
        "rangoli print": "pattern",
        "vertical print": "pattern",
        "blue print": "pattern",
        "jaipuri print": "pattern",
        "of print": "pattern",
        "zig-zag print": "pattern",
        "fabulous print": "pattern",
        "box print": "pattern",
        "geometrical print": "pattern",
        "fleur print": "pattern",
        "linear print": "pattern",
        "ajrakh print": "pattern",
        "motif print": "pattern",
        "faces print": "pattern",
        "liberty print": "pattern",
        "smart print": "pattern",
        "city print": "pattern",
        "letter print": "pattern",
        "tree print": "pattern",
        "mix print": "pattern",
        "chequered print": "pattern",
        "pretty print": "pattern",
        "buta print": "pattern",
        "sanganeri print": "pattern",
        "houdstooth print": "pattern",
        "buti print": "pattern",
        "kurta.beautiful print": "pattern",
        "ajrak print": "pattern",
        "like print": "pattern",
        "pannel print": "pattern",
        "jazzy print": "pattern",
        "temple print": "pattern",
        "woven print": "pattern",
        "scattered print": "pattern",
        "its print": "pattern",
        "floral-elephant print": "pattern",
        "gingham print": "pattern",
        "shimmery print": "pattern",
        "butta print": "pattern",
        "colourblock print": "pattern",
        "ship print": "pattern",
        "floral-geometric print": "pattern",
        "geometric-hourglass print": "pattern",
        "block-geometric print": "pattern",
        "tribal-theme print": "pattern",
        "contrastig print": "pattern",
        "quarter print": "pattern",
        "ikkat print": "pattern",
        "booti print": "pattern",
        "diagonal print": "pattern",
        "rose print": "pattern",
        "? print": "pattern",
        "bell print": "pattern",
        "horizontal print": "pattern",
        "tapingblock print": "pattern",
        "diamond-shaped print": "pattern",
        "nature-inspired print": "pattern",
        "geomtric print": "pattern",
        "swan print": "pattern",
        "hearts print": "pattern",
        "people print": "pattern",
        "weave print": "pattern",
        "stitch-detailed print": "pattern",
        "mughal-inspired print": "pattern",
        "circular print": "pattern",
        "applique print": "pattern",
        "floral-like print": "pattern",
        "one-of-a-kind print": "pattern",
        "polka print": "pattern",
        "mesmerising print": "pattern",
        "khadi print": "pattern",
        "striper print": "pattern",
        "dobby print": "pattern",
        "wavy print": "pattern",
        "abstarct print": "pattern",
        "bandhej print": "pattern",
        "tree-floral-animal print": "pattern",
        "contemporary-floral print": "pattern",
        "minimalist print": "pattern",
        "sea-boat print": "pattern",
        "peacock print": "pattern",
        "geometric-floral print": "pattern",
        "snazzy print": "pattern",
        "heels.paisley-theme print": "pattern",
        "silver print": "pattern",
        "paisley-geometric print": "pattern",
        "kutch print": "pattern",
        "two print": "pattern",
        "floral-bird print": "pattern",
        "monochrome print": "pattern",
        "self print": "pattern",
        "mixed print": "pattern",
        "herringbone print": "pattern",
        "floral-contemporary-geometric print": "pattern",
        "fancy print": "pattern",
        "floral-contemporary print": "pattern",
        "countryside-inspired print": "pattern",
        "shaded print": "pattern",
        "foil-block print": "pattern",
        "khadhi print": "pattern",
        "contemporary-abstract print": "pattern",
        "shaded-braided print": "pattern",
        "elegant print": "pattern",
        "hasfloral print": "pattern",
        "madhubani print": "pattern",
        "lantern print": "pattern",
        "retro print": "pattern",
        "floral-paisley print": "pattern",
        "nautical print": "pattern",
        "feather print": "pattern",
        "featuresfloral print": "pattern",
        "half print": "pattern",
        "lined print": "pattern",
        "checkered print": "pattern",
        "gorgeous print": "pattern",
        "stilettos.ethnic-theme print": "pattern",
        "chirpy print": "pattern",
        "zag print": "pattern",
        "unconventional print": "pattern",
        "chunnapatti print": "pattern",
        "lehriya print": "pattern",
        "floral-graffiti-block print": "pattern",
        "flower print": "pattern",
        "chevron-floral-contemporary print": "pattern",
        "perforations": "pattern",
        "woven or braided": "pattern",
        "no": "reversible",
        "yes": "reversible",
        "summer": "season",
        "fall": "season",
        "winter": "season",
        "spring": "season",
        "three-quarter sleeves": "sleeve",
        "long sleeves": "sleeve",
        "short sleeves": "sleeve",
        "sleeveless": "sleeves_type",
        "shoulder straps": "sleeve",
        "cap sleeve": "sleeve",
        "three quarter sleeves": "sleeve",
        "full sleeves": "sleeve",
        "half sleeves": "sleeve",
        "cap sleeves": "sleeves_type",
        "roll up sleeves": "sleeves_type",
        "long sleeve": "sleeve",
        "puff sleeves": "sleeves_type",
        "drop shoulder": "sleeve",
        "regular sleeves": "sleeves_type",
        "roll-up sleeves": "sleeves_type",
        "extended sleeves": "sleeves_type",
        "bell sleeves": "sleeves_type",
        "kimono sleeves": "sleeves_type",
        "cuffed sleeves": "sleeves_type",
        "butterfly sleeves": "sleeves_type",
        "slit sleeves": "sleeves_type",
        "dolman / batwing sleeves": "sleeves_type",
        "roll up": "sleeves_type",
        "cap": "sleeves_type",
        "shoulder or spaghetti straps": "sleeves_type",
        "puffed": "sleeves_type",
        "flared sleeves": "sleeves_type",
        "cold shoulder": "sleeves_type",
        "puffed sleeves": "sleeves_type",
        "front slit": "slit_detail",
        "side slits": "slit_detail",
        "no slits": "slit_detail",
        "multiple slits": "slit_detail",
        "back slit": "slit_detail",
        "stretchable": "stretch",
        "non stretchable": "stretch",
        "raw edge": "surface_styling",
        "pockets": "surface_styling",
        "cut outs": "surface_styling",
        "embellishments": "surface_styling",
        "no technique": "technique",
        "ikat": "technique",
        "shibori": "technique",
        "bandhani": "technique",
        "kalamkari": "technique",
        "leheriya": "technique",
        "batik": "technique",
        "opaque": "transparency",
        "semi sheer": "transparency",
        "t-shirt": "type",
        "polo t-shirt": "type",
        "bomber": "type",
        "puffer jacket": "type",
        "biker jacket": "type",
        "parka": "type",
        "tailored jacket": "type",
        "quilted jacket": "type",
        "open front jacket": "type",
        "denim jacket": "type",
        "leather jacket": "type",
        "sporty jacket": "type",
        "padded jacket": "type",
        "cape jacket": "type",
        "duster jacket": "type",
        "bolero jacket": "type",
        "varsity jacket": "type",
        "heeled boots": "type",
        "sandals": "type",
        "pumps": "type",
        "peep toes": "type",
        "gladiators": "type",
        "ballerina / flat shoes": "type",
        "handheld bag": "type",
        "shoulder bag": "type",
        "sling bag": "type",
        "tote bag": "type",
        "hobo bag": "type",
        "satchel": "type",
        "anarkali": "type",
        "a-line": "type",
        "pathani": "type",
        "kaftan": "type",
        "pakistani style": "type",
        "sneakers": "type",
        "slip on sneakers": "type",
        "brogues": "type",
        "loafers or moccasins": "type",
        "derbys": "type",
        "flat boots": "type",
        "espadrilles": "type",
        "skate shoes": "type",
        "boat shoes": "type",
        "oxfords": "type",
        "clogs": "type",
        "driving shoes": "type",
        "monks": "type",
        "open toe": "type",
        "t-strap / thong sandals": "type",
        "one toe": "type",
        "fit and flare": "type",
        "bodycon": "type",
        "skater": "type",
        "sheath": "type",
        "drop-waist": "type",
        "blouson": "type",
        "sweaters": "type",
        "pinafore or dungaree": "type",
        "peplum": "type",
        "wrap": "type",
        "empire-line": "type",
        "balloon dress": "type",
        "ripped": "type_of_distress",
        "cat scratches": "type_of_distress",
        "home": "usage",
        "travel": "usage",
        "with belt loops": "waist_band",
        "without belt loops": "waist_band",
        "low rise": "waist_rise",
        "mid rise": "waist_rise",
        "high rise": "waist_rise",
        "khaadi": "weave_pattern",
        "machine weave": "weave_type",
        "knitted and woven": "weave_type",
        "knitted": "weave_type",
        "handloom": "weave_type",
        "myntra": "website",
        "jabong": "website"
    };

    $scope.web_structure_level_1 = {
        "product line": {
            "question_tag": ["question_attribute"]
        },
        "blazers": {
            "fit_and_shape": [""],
            "pattern": ["pattern"],
            "colour": ["colour"],
            "cut": ["sleeve", "length"],
            "material": ["upper_material"]
        },
        "capris": {
            "fit_and_shape": ["fit", "waist_rise"],
            "cut": ["length"],
            "pattern": ["pattern"],
            "colour": ["colour"],
            "material": ["fabric"]
        },
        "casual_shoes": {
            "fit_and_shape": ["toe_shape"],
            "pattern": ["pattern"],
            "cut": ["ankle_height"],
            "colour": ["colour"],
            "material": ["upper_material"]
        },
        "dresses": {
            "pattern": ["surface_styling_or_features", "pattern_type"],
            "colour": ["colour"],
            "cut": ["dress_length", "sleeves_type", "neck"],
            "fit_and_shape": ["dress_shape"],
            "material": ["fabric"]
        },
        "flats": {
            "pattern": ["plain_pattern"],
            "fit_and_shape": ["toe_shape"],
            "cut": ["ankle_height"],
            "colour": ["colour"],
            "material": ["upper_material"]
        },
        "handbags": {
            "pattern": ["pattern"],
            "size_and_shape": ["bag_type"],
            "colour": ["colour"],
            "size_and_shape_closure": ["compartment_closure"],
            "material": ["material"]
        },
        "heels": {
            "fit_and_shape": ["toe_shape", "heel_height"],
            "pattern": ["surface_ornamentation"],
            "cut": ["ankle_height"],
            "colour": ["colour"],
            "material": ["upper_material"]
        },
        "jackets": {
            "cut": ["jacket_length"],
            "pattern": ["pattern"],
            "fit_and_shape": ["jacket_type"],
            "colour": ["colour"],
            "material": ["fabric"]
        },
        "jeans": {
            "cut": ["jeans_length"],
            "fit_and_shape": ["fit", "waist_rise"],
            "pattern": ["feature"],
            "colour": ["colour"],
            "material": ["fabric"]
        },
        "jeggings": {
            "fit_and_shape": ["fit", "closure"],
            "pattern": ["pattern"],
            "colour": ["colour"],
            "material": ["fabric"]
        },
        "jumpsuits": {
            "fit_and_shape": ["trouser_fit"],
            "pattern": ["pattern"],
            "cut": ["sleeve", "neck"],
            "colour": ["colour"],
            "material": ["fabric"]
        },
        "kurtas": {
            "colour": ["colour"],
            "pattern": ["technique", "pattern_type"],
            "fit_and_shape": ["kurta_shape"],
            "cut": ["sleeve_type", "neck"],
            "material": ["fabric"]
        },
        "shirts": {
            "pattern": ["pattern"],
            "colour": ["clour"],
            "cut": ["shirt_length", "sleeve_type"],
            "fit_and_shape": ["fit"],
            "material": ["fabric"]
        },
        "shorts": {
            "fit_and_shape": ["fit", "waist_rise"],
            "cut": ["length"],
            "pattern": ["surface_styling_or_features"],
            "colour": ["colour"],
            "material": ["fabric"]
        },
        "skirts": {
            "colour": ["colour"],
            "pattern": ["pattern"],
            "cut": ["length"],
            "fit_and_shape": ["skirt_shape"],
            "material": ["fabric"]
        },
        "sweaters": {
            "pattern": [""],
            "fit_and_shape": ["type", "closure"],
            "colour": ["colour"],
            "cut": ["", "sleeve_length", "neck"],
            "material": ["fabric"]
        },
        "sweatshirts": {
            "pattern": ["pattern", ""],
            "colour": ["colour"],
            "cut": ["sleeve_length", "neck"],
            "fit_and_shape": ["closure", "fit"],
            "material": ["fabric"]
        },
        "tops": {
            "colour": ["colour"],
            "pattern": ["pattern", "pattern_type"],
            "fit_and_shape": ["fit"],
            "cut": ["sleeves_styling", "neck"],
            "material": ["fabric"]
        },
        "trousers": {
            "fit_and_shape": ["length"],
            "cut": ["length"],
            "colour": ["colour"],
            "pattern": ["pattern"],
            "material": ["fabric"]
        },
        "tshirts": {
            "colour": ["colour"],
            "pattern": ["pattern", "pattern_type"],
            "fit_and_shape": ["fit"],
            "cut": ["sleeve", "neck"],
            "material": ["fabric"]
        }
    };

    ////

    // march 7

    $scope.undo_tag = 0;
    var title = {};
    title["title"] = $routeParams.search;
    $scope.load = function () {
        $scope.current_productline = '';
        $scope.ref = 0;
        // console.log('state in main>'+ $rootScope.restorestate);
       if ($localStorage["deviceId"] == undefined || $localStorage["deviceId"] == '') {
            var client = new ClientJS();
            $scope.device_id = Date.now().toString() + "_" + client.getFingerprint();
            $localStorage["deviceId"] = $scope.device_id;
            $localStorage["landing_page_url"] = $location.absUrl();
            console.log($scope.device_id);
        } else {
            var prev_timestamp = $localStorage.deviceId.substring(0,$localStorage.deviceId.indexOf("_"));
            var curr_timestamp = Date.now().toString();
            if(curr_timestamp - prev_timestamp < 10800000) {
                console.log("Unique device id from local Storage ", $localStorage.deviceId);
                $scope.device_id = $localStorage.deviceId;
                console.log($scope.device_id);
            }
            else{
                var client = new ClientJS();
                $scope.device_id = Date.now().toString() + "_" + client.getFingerprint();
                $localStorage["deviceId"] = $scope.device_id;
                console.log($scope.device_id);
                $localStorage["landing_page_url"] = $location.absUrl();
            }
        }


        console.log("localStorage.search ",$localStorage.search);
        console.log("routeParams.search",$routeParams.search);

                 /* modified by chinmesh on 13/06/17 , the $localStorage.search is set only in setProductPage function */
        if ($routeParams.search == $localStorage.search ) { /* && $localStorage.search != 'women') { */
            
            //$localStorage.search = "" ;

            $scope.showload = 0;
            console.log("in main if ");
            console.log('showload at .load>__' + $scope.showload);
            $scope.users = [];
            $scope.ini_users = [];
            $scope.currentUser = 'User';

            $scope.users = $localStorage.users ; //.concat($localStorage.ini_users);
            //$scope.users = $localStorage.users ;
            $scope.ini_users = $localStorage.ini_users ;
            /* causing duplicates $scope.ini_users = $localStorage.ini_users ; */
            console.log("in main users : " , $scope.users);
            console.log("in main ini_users : " , $scope.ini_users);

            $scope.products_list = [];
            $scope.total_items = $localStorage.total_items;

            $scope.productline_name = $localStorage.productline_name ;
            
            console.log("TextTag before",$scope.textTag);
            $scope.textTag = $localStorage.textTag;
            console.log("TextTag now",$scope.textTag);

            $scope.current_page = $localStorage.current_page;
            $scope.products_list = $localStorage.products_list;
            
            console.log("Product list now set to ", $scope.products_list);    

            $scope.session_id = $localStorage.session_id;
            if ($scope.products_list != undefined) $scope.remining = Math.abs($scope.total_items - $scope.products_list.length);
            $scope.inspiration_tiles = $localStorage.inspiration_tiles;
            $scope.filters = $localStorage.filters;
            $scope.filters_list = $localStorage.filters_list;
            $scope.all_filters_arrays = $localStorage.all_filters_arrays;


            //Web structure variables
            $scope.web_structure_show_brands =  $localStorage.web_structure_show_brands ;
            $scope.web_structure_show_factors = $localStorage. web_structure_show_factors;
            $scope.show_foot = $localStorage.show_foot ;
            
            //UA FORM VARIABLES
            $scope.show_ua = $localStorage.show_ua ;
            $scope.show_ua_form = $localStorage.show_ua_form ;
            $scope.ua_form_submitted = $localStorage.ua_form_submitted ;
            $scope.show_ua_edit = $localStorage.show_ua_edit ;

            $scope.show_bc = $localStorage.show_bc ;
            $scope.show_bc_form = $localStorage.show_bc_form ;
            $scope.bc_form_submitted = $localStorage.bc_form_submitted ;
            $scope.show_bc_edit = $localStorage.show_bc_edit ;
            $scope.multi_select_selected = $localStorage.multi_select_selected ;

            $scope.temp_list =  $localStorage.temp_list ;
            $scope.temp_headings = $localStorage.temp_headings ;
            $scope.temp_total_items = $localStorage.temp_total_items ;


            $scope.chat_callback_data = $localStorage.chat_callback_data ;
            $scope.first_query_sent = $localStorage.first_query_sent ;

     
            console.log("Adding benifits data",$localStorage.applied_benefits);
            $scope.all_benefits_type = $localStorage.all_benefits_type;
            $scope.all_benefits = $localStorage.all_benefits ; 
            $scope.applied_benefits = $localStorage.applied_benefits ;

            /* to scroll back to previous location , scroll values set in setProductPage function */
            console.log("localStorage",$localStorage);
            
            $timeout(function () {
                var scroll_y_m = $localStorage.page_scroll_y - 80 ;/* little bit of offset is added */
                $window.scrollTo($localStorage.page_scroll_x, scroll_y_m );
                //$("html, body").animate({ scrollDown:scroll_y_m  }, 2000);
            }, 3000);
            
            
            for (var key in $scope.all_filters_arrays) {
                eval(key + '=[]');
                var values = $scope.all_filters_arrays[key];
                for (var i in values) {
                    eval(key).push(values[i]);
                }
                // console.log('dynm>'+ eval(key));
            }

            // console.log('json time >', JSON.stringify($scope.session_id));
            $timeout(function () {
                $location.hash('bottom');
                $anchorScroll();
                $location.hash('');
                $location.replace();
            }, 3000);
            //data = '{ "session_id" :"' + $scope.session_id + '","device_id"  :"' + $scope.device_id + '" ,"user_name"  :"' + $scope.currentUser + '"}';
            //socket.emit('add user', data); // responces are chat and browse

            if($scope.bc_form_submitted == 0 || $scope.ua_form_submitted == 0){
                //var data = '{"session_id" :"' + $scope.session_id + '","device_id"  :"' + $scope.device_id + '","user_name"  : "User ","type" : "message" ,"message" :"clear" }';
                //socket.emit('reset', data);
                //resetChat();
            }


        } else {
            $window.scrollTo(0,0);
            console.log("in main else ");
            var session = Date.now();
            $scope.session_id = session.toString();
            console.log($scope.session_id);
            $scope.currentUser = 'User';

            $scope.products_list = [];
            $scope.users = [];
            $scope.ini_users = [];
            $scope.inspiration_tiles = [];
        

            var query = $location.absUrl().substr($location.absUrl().indexOf("find/") + 5);
            var pre_chat = {};
            pre_chat["message"] = query.replace(/-/g, " ");
            pre_chat["session_id"] = "3483834834834";
            pre_chat["device_id"] = "msdnlkafdnoacsndoahesh";
            pre_chat["user_name"] = "User";

            console.log("LocalStorage",$localStorage);
            socket.emit('question', JSON.stringify(pre_chat));
        }

        socket.on('title', function (data) {
            title["title"] = data.question;
        });   


    };
    $scope.load();

    $scope.setOccasions = function () {
        if ($scope.current_productline != '' && $scope.current_productline != undefined) {
            // console.log(':' + $scope.current_productline + ':');
            $scope.occasions = [];
            $scope.res_occasions = Object.keys(occasion_mapping[$scope.current_productline]);
            // console.log('list of occasions >', $scope.occasions);
            $scope.available_occasions = ['anniversary', 'beach', 'birthday', 'brunch', 'casual', 'casual_wear', 'clubbing', 'cocktail', 'cold', 'college', 'college_party', 'daily_wear', 'date', 'dinner', 'semi_formal', 'heavy_wedding', 'holiday-trips', 'hot', 'lunch', 'office_party', 'office_wear', 'pool_party', 'formal', 'simple_wedding', 'sports_wear', 'wedding'];

            console.log($scope.res_occasions);
            console.log($scope.available_occasions);

            for (var i = 0; i < $scope.res_occasions.length; i++) {
                for (var j = 0; j < $scope.available_occasions.length; j++) {
                    if ($scope.res_occasions[i] === $scope.available_occasions[j].replace(/_/g, "-")) {
                        $scope.occasions.push($scope.available_occasions[j]);
                        //console.log("Occasions ", $scope.occasions);
                        break;
                    }
                }
            }

            //added 31/05/2017 for product factors
            console.log($scope.productline_name);
            console.log($scope.current_productline);
            $scope.web_structure_list_level_1 = {};
            var web_structure_keys = Object.keys($scope.web_structure_level_1[$scope.productline_name]);
            for (var _i in web_structure_keys) {
                $scope.web_structure_list_level_1[web_structure_keys[_i]] = $scope.web_structure_level_1[$scope.productline_name][web_structure_keys[_i]].slice();
            }
            var attributes = [];
            for (var key in $scope.web_structure_list_level_1) {
                attributes = attributes.concat($scope.web_structure_list_level_1[key]);
            }
            if($scope.productline_name =='kurtas')
            var tag = 'kurta';  
            else
            var tag = $scope.productline_name;
            
            data = {
                "attributes": attributes,
                "product_line": "women_" + tag
            };
            console.log(data);
            $http({
                url: $rootScope.socketUrl + '/selekt/adjective',
                method: "POST",
                data: { 'data': data }
            }).then(function (response) {
                //alert("success");

                console.log(response);
                for (var key in $scope.web_structure_list_level_1) {
                    var values = $scope.web_structure_list_level_1[key];
                    $scope.web_structure_list_level_1[key] = [];
                    console.log(key);
                    for (var y in values) {
                        var item = values[y];
                        //console.log('y valye >'+ item);
                        var array2 = response["data"][item];
                        //console.log("array 2 >"+array2);
                        for (var item in array2) {
                            var value = array2[item];
                            $scope.web_structure_list_level_1[key].push(value);
                        }
                        //console.log("total >" + JSON.stringify($scope.web_structure_list_level_1) );
                    }
                }
            }, function (response) {
                console.log("failed");
            });
        }
    };

    $scope.show_foo = function () {
        show_foot = 1;
    };



    //for refresh list
    $scope.on_inp = function () {
        $scope.ref = 1;
    };

    $scope.pathChanged = function (title) {
        $scope.backup = userService;
        $rootScope.query = $location.absUrl().substr($location.absUrl().indexOf("find/") + 5).replace(/%20/g,"-");;
        console.log($rootScope.query);
        $rootScope.query = $rootScope.query.replace(/ /g, "-");
        $location.path('/find/' + $rootScope.query);
        $rootScope.query = $rootScope.query.replace(/-/g, " ");
        $scope.route = '';
        var data = '';
        /*
         switch ($rootScope.query) {
         case 'women' :
         route = 'women';
         break;
         case 'men' :
         route = 'men';
         break;
         default :
         route = 'find';
         break;
         }
         */
        if ($rootScope.query == "women") {
            $scope.route = 'women';
            var title = ' Women fashion online | What to wear | selekt.in';
            $window.document.title = title.charAt(0).toUpperCase() + title.substr(1);
        } else if ($rootScope.query.indexOf("shop")!=-1) $scope.route = 'brands';
        else $scope.route = 'find';

        //called at the start of each selekt.in/find/:search request
        if ($scope.route == 'find') {
            
            data = '{"status" : ' + true + ' ,"session_id" :"' + $scope.session_id + '","device_id"  : "' + $scope.device_id + '", "landing_page_url"  :"' + $localStorage["landing_page_url"] + '" ,"user_name"  :"' + $scope.currentUser + '"}';
            if ($localStorage.search != $routeParams.search){
                console.log("pathchanged $scope.route == find if ");
                socket.emit('add user', data);
            }else{
                console.log("pathchanged $scope.route == find else ");

            }
            
            console.log('find_add user' + data);
            if ($routeParams.search != $localStorage.search) {
                $scope.showload = 1;
                console.log('showload at route==find>' + $scope.showload);
            }else{
                $scope.showload = 0;
            }

            if ($rootScope.query.indexOf('tops')!=-1) {
                var title = title.title.replace(/-/g, " ") + ' | Buy tops online in India at best price | Myntra, Jabong | selekt.in';
                $window.document.title = title.charAt(0).toUpperCase() + title.substr(1);
            } else if ($rootScope.query.indexOf('dress')!=-1) {
                var title = title.title.replace(/-/g, " ") + ' | Buy western wear dresses for women | Myntra, Jabong | selekt.in';
                $window.document.title = title.charAt(0).toUpperCase() + title.substr(1);
            } else if ($rootScope.query.indexOf('kurta')!=-1) {
                var title = title.title.replace(/-/g, " ") + ' | Buy kurtas online in India at best price | Myntra, Jabong | selekt.in';
                $window.document.title = title.charAt(0).toUpperCase() + title.substr(1);
            } else if ($rootScope.query.indexOf('jumpsuit')!=-1) {
                var title = title.title.replace(/-/g, " ") + ' | Buy jumpsuits online in India at best price | Myntra, Jabong | selekt.in';
                $window.document.title = title.charAt(0).toUpperCase() + title.substr(1);
            } else {
                var title = title.title.replace(/-/g, " ");
                title = title + ' | Buy ' + title + ' online in India | Myntra, Jabong | selekt.in';
                $window.document.title = title.charAt(0).toUpperCase() + title.substr(1);
            }
            /* Uncomment this to get direct link for jeans
             if ($rootScope.query.includes('jeans')) {
             $rootScope.add_link = 1;
             }
             if ($rootScope.query.includes('handbag')) {
             $scope.add_description = 1;
             }
             if ($rootScope.query.includes('jacket')) $scope.content_type = 0;
             else
             */
            $scope.content_type = 1;

            $scope.product_list_content_dir = 1;
            $scope.inspirations_dir = 0;

            $scope.webpage_num = 0;
            var _pre_chat = {};
            _pre_chat["message"] = $routeParams.search;
            _pre_chat["session_id"] = $scope.session_id;
            _pre_chat["device_id"] = $scope.device_id;
            _pre_chat["user_name"] = $scope.currentUser;
            _pre_chat["from"] = $scope.webpage_num;
            if ($localStorage["ua_form_submitted"] == 1 || $localStorage["bc_form_submitted"] == 1) _pre_chat["profile_state"] = 1;else _pre_chat["profile_state"] = 0;

            //pre_chat = '{"message" :"' + $routeParams.search + '", "session_id" :"' + $scope.session_id + '","device_id"  :  "' + $scope.device_id  + '","user_name"  :"' + $scope.currentUser + '" ,"from" : ' + $scope.webpage_num + '}';
            if ($localStorage.search != $routeParams.search){
                socket.emit('web', JSON.stringify(_pre_chat));
                console.log("pathchanged $scope.route == find  2 if ");
            }else{
                console.log("pathchanged $scope.route == find  2 else ");
            }
            console.log("Data>>> ", _pre_chat);
        }

        if ($scope.route == 'women') {
            /* modified by chinmesh on 14/06/17 */
            if ($routeParams.search == $localStorage.search ) {
                console.log("womens reached if ");
                $scope.product_list_content_dir = 1;
                $scope.inspirations_dir = 0;
            }
            else{
                console.log("womens reached else ");
                data = '{"status" : ' + false + ' ,"session_id" :"' + $scope.session_id + '","device_id"  :  "' + $scope.device_id + '","landing_page_url"  :"' + $localStorage["landing_page_url"] + '" ,"user_name"  :"' + $scope.currentUser + '"}';
                socket.emit('add user', data);
                console.log('women_add user' + data);
                $scope.product_list_content_dir = 0;
                $scope.inspirations_dir = 1;
            }

        }
        if ($scope.route == 'brands') {
            $scope.product_list_content_dir = 0;
            $scope.inspirations_dir = 0;
            $scope.shop_by_brands_dir = 1;
            data = '{"status" : ' + true + ' ,"session_id" :"' + $scope.session_id + '","device_id"  :  "' + $scope.device_id + '","landing_page_url"  :"' + $localStorage["landing_page_url"] + '" ,"user_name"  :"' + $scope.currentUser + '"}';
            socket.emit('add user', data);
            console.log('find_add user' + data);
            $scope.webpage_num = 0;
            var _pre_chat2 = {};
            _pre_chat2["message"] = $routeParams.search;
            _pre_chat2["session_id"] = $scope.session_id;
            _pre_chat2["device_id"] = $scope.device_id;
            _pre_chat2["user_name"] = $scope.currentUser;
            _pre_chat2["from"] = $scope.webpage_num;
            if ($localStorage.search != $routeParams.search) socket.emit('web', JSON.stringify(_pre_chat2));
            console.log("Data>>> " + _pre_chat2 + " Query>> " + $rootScope.query);
        }
    };
    $scope.range = function (max, step) {
        step = step || 1;
        var input = [];
        for (var i = 0; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };
    $scope.pathChanged(title);

    $scope.IdentifyEntity = function check_for_attribute(message) {
        var attribute_values = Object.keys(attribute_value_default_keys);
        var attribute_value_exists = false;
        attribute_values.sort(function (a, b) {
            return b.length - a.length;
        });
        var msg_array = message.split(" ");
        for (var i in attribute_values) {
            if (message.indexOf(attribute_values[i]) != -1) {
                message = message.replace(attribute_values[i], "");
                attribute_value_exists = true;
            }
        }
        return [attribute_value_exists, message];
    };
    ////////
    $scope.Entity = function check_for_attribute(message) {
        var entities = [];
        var attribute_values = Object.keys(attribute_value_default_keys);
        attribute_values.sort(function (a, b) {
            return b.length - a.length;
        });
        var msg_array = message.split(" ");
        for (var i in attribute_values) {
            if (msg_array.indexOf(attribute_values[i]) != -1) {
                if (!entities.hasOwnProperty("attribute_value")) {
                    entities["attribute_value"] = [];
                }
                entities["attribute_value"].push(attribute_values[i]);
                message = message.replace(attribute_values[i], "");
                msg_array.splice(msg_array.indexOf(attribute_values[i]), 1);
            }
        }
        return [entities, message];
    };

    var newArry = $scope.Entity($rootScope.query.replace(/-/g, " "));
    // console.log("new arry>", newArry);
    ////////
    var getArray = $scope.IdentifyEntity($rootScope.query.replace(/-/g, " "));
    if (getArray[1].indexOf('flat')!=-1) {
        $scope.show_content = getArray[0];
        // console.log('result>>', getArray);
    }
    // console.log('result>>', getArray);
    if (newArry[1].indexOf('tshirt')!=-1) {
        $rootScope.canonical_url = 'https://www.selekt.in/find/' + newArry[1].trim();
        // console.log('$rootScope.canonical_url>>', $rootScope.canonical_url);
    }

    var ua_rootscope_query = $rootScope.query;
    var nameToKeyKeys = Object.keys(nameToKey);
    for (var i in nameToKeyKeys) {
        if (ua_rootscope_query.indexOf(nameToKeyKeys[i]) != -1) {
            ua_rootscope_query = ua_rootscope_query.replace(nameToKeyKeys[i], '');
        }
    }
    var heights = ['short', 'tall', 'average'];
    var skin_color = ['fair', 'dusky', 'wheatish'];
    var body_shape = ['apple', 'rectangle', 'hour glass', 'pear'];
    var age = ['18', '28', '39'];

    for (var h in heights) {
        if (ua_rootscope_query.indexOf(heights[h]) != -1) {
            $scope.user_selected_categories.height = "-" + heights[h];
            break;
        }
    }

    for (var b in body_shape) {
        // console.log("URL  >>  ", $rootScope.query);
        // console.log("Body Shape >> ",body_shape[b]);
        var te = body_shape[b].replace(/ /g, '');
        if (ua_rootscope_query.indexOf(te) != -1) {
            $scope.user_selected_categories.body_shape = "-" + body_shape[b] + " shape";
            break;
        }
    }

    for (var s in skin_color) {
        if (ua_rootscope_query.indexOf(skin_color[s]) != -1) {
            $scope.user_selected_categories.skin_color = "-" + skin_color[s];
            break;
        }
    }
    for (var a in age) {
        // console.log("URL  >>  ", $rootScope.query);
        // console.log("Age >> ",age[a]);
        if (ua_rootscope_query.indexOf(age[a]) != -1) {
            if (age[a] == '18') {
                $scope.user_selected_categories.age = "-" + '18-27' + " age";
                // $rootScope.query.replace(/18 27/g,'tenager');
            } else {
                $scope.user_selected_categories.age = "-" + '28-38' + " age";
                // $rootScope.query.replace(/28 38/g,'adult');
            }
            break;
        }
    }
    if ($scope.occasions != undefined) {
        for (var oc in $scope.occasions.sort(function (arg1, arg2) {
            return arg2.length - arg1.length;
        })) {
            var te = $scope.occasions[oc].replace(/_/g, ' ');
            // console.log('checking >' + te + ' in ' + $rootScope.query);
            if (ua_rootscope_query.indexOf(te) != -1) {
                console.log('checked >>' + te);
                $scope.user_selected_categories.occasion = te + "-";
                $scope.occasion_name = occasion_mapping[$scope.current_productline][$scope.user_selected_categories.occasion];
                console.log('display_name>', $scope.occasion_name);
                break;
            }
        }
    }
    // console.log("selected categories>> ", $scope.user_selected_categories);
    $rootScope.meta_desc = "Selekt is a chat based interactive assistant that helps in finding products suiting your needs. Based on your requirements, Selekt recommends a list of products with the features, specification, application etc.";

    if ($scope.productline_name != undefined) {
        console.log('productline1', $scope.productline_name);
        if ($scope.productline_name == "dresses" || $scope.productline_name == "jeans" || $scope.productline_name == "skirts" || $scope.productline_name == "dress") {
            if ($scope.user_selected_categories.occasion != '') {
                $rootScope.meta_desc = "Buying the right " + $scope.user_selected_categories.occasion + " " + $scope.productline_name + " for ";
                if ($scope.user_selected_categories.height != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.height.replace(/-/g, '') + " ";
                if ($scope.user_selected_categories.age != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.age.replace('-', '') + " ";
                if ($scope.user_selected_categories.body_shape != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.body_shape.replace(/-/g, '') + " ";
                if ($scope.user_selected_categories.skin_color != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.skin_color.replace(/-/g, '') + " ";
                $rootScope.meta_desc = $rootScope.meta_desc + "women is always a challenge. Selekt provides you expert assistance in what to choose to look fabulous!";
            } else {

                $rootScope.meta_desc = "Look at your best by picking the perfect " + $scope.productline_name + " for ";
                if ($scope.user_selected_categories.height != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.height.replace(/-/g, '') + " ";
                if ($scope.user_selected_categories.age != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.age.replace('-', '') + " ";
                if ($scope.user_selected_categories.body_shape != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.body_shape.replace(/-/g, '') + " ";
                if ($scope.user_selected_categories.skin_color != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.skin_color.replace(/-/g, '') + " ";
                $rootScope.meta_desc = $rootScope.meta_desc + "women at selekt.in. Best designs customized and picked as per your requirement. Interact and Buy!";
            }
        } else if ($scope.productline_name == "tops" || $scope.productline_name == "tshirts" || $scope.productline_name == "jackets") {
            if ($scope.user_selected_categories.occasion != '') {
                $rootScope.meta_desc = "Now discover what " + $scope.user_selected_categories.occasion + " " + $scope.productline_name + " fits for ";
                if ($scope.user_selected_categories.height != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.height.replace(/-/g, '') + " ";
                if ($scope.user_selected_categories.age != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.age.replace('-', '') + " ";
                if ($scope.user_selected_categories.body_shape != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.body_shape.replace(/-/g, '') + " ";
                if ($scope.user_selected_categories.skin_color != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.skin_color.replace(/-/g, '') + " ";
                $rootScope.meta_desc = $rootScope.meta_desc + "women the best with ease. Interact with Selekt and buy your Favourite Styles and Collections.";
            } else {

                $rootScope.meta_desc = "Selekt assists you to find the right " + $scope.productline_name + " for ";
                if ($scope.user_selected_categories.height != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.height.replace(/-/g, '') + " ";
                if ($scope.user_selected_categories.age != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.age.replace('-', '') + " ";
                if ($scope.user_selected_categories.body_shape != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.body_shape.replace(/-/g, '') + " ";
                if ($scope.user_selected_categories.skin_color != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.skin_color.replace(/-/g, '') + " ";
                $rootScope.meta_desc = $rootScope.meta_desc + "women. Look fabulous and feel great by choosing the ideal styles and collections.";
            }
        } else {
            if ($scope.user_selected_categories.occasion != '') {
                $rootScope.meta_desc = "Selekt is the right place for finding " + $scope.user_selected_categories.occasion + " " + $scope.productline_name + " for ";
                if ($scope.user_selected_categories.height != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.height.replace(/-/g, '') + " ";
                if ($scope.user_selected_categories.age != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.age.replace('-', '') + " ";
                if ($scope.user_selected_categories.body_shape != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.body_shape.replace(/-/g, '') + " ";
                if ($scope.user_selected_categories.skin_color != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.skin_color.replace(/-/g, '') + " ";
                $rootScope.meta_desc = $rootScope.meta_desc + "women. We guide you to the right styles by interacting with you.";
            } else {

                $rootScope.meta_desc = "Selekt is the right place for finding " + $scope.productline_name + " for ";
                if ($scope.user_selected_categories.height != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.height.replace(/-/g, '') + " ";
                if ($scope.user_selected_categories.age != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.age.replace('-', '') + " ";
                if ($scope.user_selected_categories.body_shape != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.body_shape.replace(/-/g, '') + " ";
                if ($scope.user_selected_categories.skin_color != '') $rootScope.meta_desc = $rootScope.meta_desc + $scope.user_selected_categories.skin_color.replace(/-/g, '') + " ";
                $rootScope.meta_desc = $rootScope.meta_desc + "women. Look fabulous and feel great by choosing the ideal styles and collections.";
            }
        }
    }

    //        =================For web structure ======================


    //        =========================================================

    socket.on('connect', function () {});

    socket.on('remove_profile', function (data) {
        console.log(JSON.stringify(data));
        if (data.type == "body_concerns") {
            $scope.reset_bc();
            $localStorage.inspiration_tiles=[];
            $scope.inspiration_tiles=[];
            //$localStorage.bc_form_submitted=0;
            //                $scope.bc_form_submitted=0;
            $scope.bc_form_submitted=0;
            $scope.show_bc_form = 1;
            $scope.show_bc_edit = 0;
        } else if (data.type == "profile_benefit") {
            $scope.reset_ua();

            $localStorage.$reset();
            $scope.show_bc_form = 0;
            $scope.ua_form_submitted=0;
            $scope.show_ua_form = 1;
            $scope.show_bc_edit = 0;
            $scope.show_ua_edit = 0;
        }
    });
    socket.on('updatechat', function (username, data) {
        var user = {};
        user.username = 'User';
        user.message = data;
        user.date = new Date().getTime();
        user.image = 'https://dummyimage.com/250x250/000/fff&text=' + username.charAt(0).toUpperCase();
        $scope.users.push(user);
    });
    var data = '{"session_id" : "' + $scope.session_id + '","device_id"  : "' + $scope.device_id + '","user_name"  : "user"}';

    socket.on('bot login', function (data) {});

    var force_request = 0;
    socket.on('chat', function (data) {
        console.log("Chat received");
        console.log(data);
        $scope.showtype = 1;
        $timeout(function () {
            console.log("-1");
            if (data["show_message"] == true) $scope.ref = 0;
            $scope.showtype = 0;
            console.log("0");
            if ($rootScope.query != 'women' && $scope.first_time_heading) {
                if ($scope.question == undefined) {
                    $scope.headings = $rootScope.query.charAt(0).toUpperCase() + $rootScope.query.substr(1).toLowerCase() + ' -';
                    $scope.temp_headings = $scope.headings;
                } else {
                    $scope.headings = $scope.question + ' -';
                    $scope.temp_headings = $scope.headings;
                }
                $scope.first_time_heading = 0;
            }
            // console.log("Chat >> ",JSON.stringify(data));
            if (data.type == "text" && !force_request && ($localStorage.ua_form_submitted == undefined || $localStorage.ua_form_submitted == 0) && ($localStorage.bc_form_submitted == undefined || $localStorage.bc_form_submitted == 0)) {
                console.log("1");
                var user = {};
                user.username = 'Selekt';
                user.message = data.message;
                user.date = new Date().getTime();
                user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
                $scope.latestMesg = user;
                $scope.ini_users.push($scope.latestMesg);
                if (data["show_message"] == true) $scope.ref = 0;
            } else {
                console.log("2");
                if ((($scope.ua_form_submitted == 1 || $localStorage.ua_form_submitted == 1) && ($scope.bc_form_submitted == 1 || $localStorage.bc_form_submitted == 1))||force_request===1) {
                    console.log("3");
                    if (data.type == "text") {
                        console.log("4");
                        var user = {};
                        user.username = 'Selekt';
                        user.message = data.message;
                        user.date = new Date().getTime();
                        user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
                        $scope.latestMesg = user;
                        $scope.users.push($scope.latestMesg);
                    } else if (data.type == "multi_select") {
                        $scope.inspiration_tiles = [];
                        var _user = {};
                        _user.username = 'Selekt';
                        _user.message = data.text;
                        _user.date = new Date().getTime();
                        _user.image = 'https://dummyimage.com/250x250/000/fff&text=' + _user.username.charAt(0).toUpperCase();
                        $scope.users.push(_user);
                        $scope.multi_select = data.options;
                        $localStorage.multi_select = data.options;
                    } else if (data.type == "single_select") {
                        $scope.multi_select = [];
                        var user = {};
                        user.username = 'Selekt';
                        user.message = data.text;
                        user.date = new Date().getTime();
                        user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
                        $scope.users.push(user);
                        var title = data.title;
                        $scope.inspiration_tiles = data.options;
                        $localStorage.inspiration_tiles = data.options;
                        var options = data.options;
                    }
                    $localStorage.users = $scope.users;
                    if (data["show_message"] == true) $scope.ref = 0;
                } else {
                    $scope.first_query_sent = 1;
                    $scope.chat_callback_data.push(data);
                    if (data["show_message"] == true) $scope.ref = 0;
                }
            }
            $timeout(function () {
                $scope.scrollToBottom();
            }, 500);
        }, 2000);
    });

    socket.on('wait', function () {
        //$scope.showtype = 1;
    });

    socket.on('benefits', function (data) {
         console.log("benefit!@: ", data);
        $scope.sentences = data.sentences;
        $scope.tabular = data.tabular;
        // console.log("sentence>", $scope.sentences);
        $scope.question = data.question;
        if (0) {
            if ($scope.question == undefined) {
                $scope.headings = $rootScope.query.charAt(0).toUpperCase() + $rootScope.query.substr(1).toLowerCase() + ' -';
                $scope.temp_headings = $scope.headings;
            } else {
                $scope.headings = $scope.question + ' -';
                $scope.temp_headings = $scope.headings;
            }
        }
    });

    var temp_popular_searches = [];
    var apply_popular_searches = function(){
        for (var _i10 in temp_popular_searches) {
            temp_popular_searches[_i10]["link"] = temp_popular_searches[_i10]["link"].replace(' '+$scope.productline_name, "");
        }
        console.log("popular searches: ", temp_popular_searches);
        $scope.popular_searches = [];
        $scope.popular_searches = temp_popular_searches;
    };

    socket.on('browse', function (data) {   

        if($localStorage.search != $routeParams.search){

            console.log("Browse : ",data.type);
            console.log('showload at pst', $scope.showload);
            $scope.showload = 0;
            console.log("if condition for showload",data.type,$scope.ref,$scope.current_page);
            if (data.type != 'product_list' && !$scope.ref && !$scope.current_page) {
                $scope.showload = 1;
                //console.log("1");
            } else if (data.current_page == 0 && !$scope.ref) $scope.showload = 1;
            $localStorage.users = $scope.users;
            $localStorage.session_id = $scope.session_id;
            $scope.resultCame = 1;
            if (data.type == 'inspirations') {
                $scope.inspirations_false = data.slides_false;
                $scope.inspirations_true = data.slides_true;
                //  console.log("Inspirations >> ", data);
            }
            if (data.type == 'filter_list') {
                $scope.showload = 0;
            /*
                
                console.log('in filters');
                console.log(data);
                $scope.filters = data.options;
                $scope.popular_searches = [];

                $scope.brandLetter = 'a';
                $scope.brand_values = $scope.filters[0].values;
                $scope.shop_by_brands = {};
                for (var x in $scope.brand_values) {
                    var letter = $scope.brand_values[x].charAt(0);
                    if ($scope.shop_by_brands[letter] == undefined) $scope.shop_by_brands[letter] = [];
                    $scope.shop_by_brands[letter].push($scope.brand_values[x]);
                }
                //console.log("=========" + JSON.stringify($scope.shop_by_brands ));

                $scope.filters_list = [];
                $scope.all_filters_arrays = {};
                for (var index in $scope.filters) {
                    // console.log('type>>',JSON.stringify($scope.filters[index].key));
                    var a = '$scope.' + $scope.filters[index].key + 'Includes';
                    var filter_array = '$scope.' + $scope.filters[index].key + 'Includes = []';
                    var filter_array_2 = '$localStorage.' + $scope.filters[index].key + 'Includes = []';
                    eval(filter_array);
                    $scope.all_filters_arrays[a] = [];
                    var json = {};
                    json['key'] = $scope.filters[index].key;
                    json['values'] = [];
                    $scope.filters_list.push(json);
                    // console.log('eval>'+eval(a));
                }
                // console.log('all_filters_arrays>'+JSON.stringify($scope.all_filters_arrays));

                $localStorage.all_filters_arrays = $scope.all_filters_arrays;
                $localStorage.filters = $scope.filters;
                $localStorage.filters_list = $scope.filters_list;
            */
            }
            if (data.type == 'benefit_list') {
                $scope.applied_benefits = data.list;
                $scope.all_benefits = data.all_benefits;
                $scope.all_benefits_type = [];
                for (var _i2 in $scope.all_benefits) {
                    $scope.all_benefits_type.push($scope.all_benefits[_i2]["display_name"]);
                }
                console.log("Benefits Received");
                $localStorage.applied_benefits = $scope.applied_benefits ;
                $localStorage.all_benefits = $scope.all_benefits ;
                $localStorage.all_benefits_type = $scope.all_benefits_type;
            }
            if (data.type == "product_list") {
                console.log("products list ", data);
                $scope.product_list_content_dir = 1;
                $scope.inspirations_dir = 0;
                $scope.current_productline = nameToKey[data.product_line];
                $scope.productline_name = data.product_line;
                //$scope.products_list=$localStorage.products_list;
                console.log($scope.current_productline);
                apply_popular_searches();
                $scope.setOccasions();
                $scope.current_page = data.current_page;
                $localStorage.current_page = $scope.current_page;
                var list = data.list;
                if ($scope.current_page == 0) {

                    if ($scope.ref == 0) $scope.products_list = list;else {
                        $scope.temp_list = list;
                        $scope.showload = 0;
                    }
                } else {
                    // console.log('@@@ concat list >');
                    console.log("prodo len", $scope.products_list.length);
                    if ($scope.ref == 0) {
                        $scope.products_list = $scope.products_list.concat(list);
                        console.log('showload before concat', $scope.showload);
                    } else {
                        $scope.temp_list = temp_list.concat(list);
                        $scope.showload = 0;
                    }
                    //$scope.remining = Math.abs(( ( $scope.total_items ) - ( $scope.products_list.length ) ));
                    //console.log('product_list has >',$scope.total_items);
                    //console.log('in else of push',$scope.products_list.length);
                }
                //now push the server response in chat
                if ($scope.current_page == undefined) {
                    $scope.textTag = 1;
                    $localStorage.textTag = 1;
                } else {
                    $scope.textTag = 0;
                    $localStorage.textTag = 0;
                }
                $scope.total_items = data.total_length;
                $localStorage.total_items = $scope.total_items;
                if ($scope.total_items == undefined) {
                    $scope.total_items = $scope.products_list.length;
                }
                $scope.remining = Math.abs($scope.total_items - $scope.products_list.length);
                $scope.show_loader =0;
                console.log('reming = ' + $scope.remining + 'total>' + $scope.total_items + '- products_length>' + $scope.products_list.length);
                $timeout(function () {
                    $scope.showload = 0;
                }, 1000);
                $localStorage.products_list = $scope.products_list;
                if (data["show_message"] == true) $scope.ref = 0;
                //added 5/26/17

                //added on 24-5-17
                 if ($scope.popular_searches.length === 0) {
                    var exclude_filter = ["all_size", "discount_price", "discount_percent", "brand"];
                    for (var i in $scope.web_structure_level_1[$scope.productline_name]) {
                        for (var j in $scope.web_structure_level_1[$scope.productline_name][i]) {
                            exclude_filter.push($scope.web_structure_level_1[$scope.productline_name][i][j]);
                        }
                    }
                    var temp_links = [];
                    for (var x in $scope.filters) {
                        var filter = $scope.filters[x].key;
                        if (exclude_filter.indexOf(filter) == -1) {
                            temp_links = temp_links.concat($scope.filters[x].values);
                        }
                    }
                    for(var i0 in temp_links){
                        $scope.popular_searches.push({"link":temp_links[i0],"flag":true});
                    }
                    $scope.popular_searches = $scope.popular_searches.filter(function (item, pos) {
                        return $scope.popular_searches.indexOf(item) == pos;
                    });
                }
                $scope.htmlReady();


                $localStorage.temp_list = $scope.temp_list  ;
                $localStorage.showload = $scope.showload  ;
                
                $localStorage.products_list =$scope.products_list ;           
                $localStorage.temp_list = $scope.temp_list ;
                $localStorage.textTag  = $scope.textTag;
                
                $localStorage.total_items = $scope.total_items  ;
        
                $localStorage.remining = $scope.remining ;    

            }
            if (data["show_message"] == true) {
                //alert();
                $scope.ref = 0;
                console.log('ref here' + $scope.ref);
                if (data.hasOwnProperty("message")) {
                    if (data["message"]["message"] != "") {
                        if (data["message"]["type"] == "text") {
                            var user = {};
                            user.username = 'Selekt';
                            user.message = data["message"]["message"];
                            user.date = new Date().getTime();
                            user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
                            $scope.users.push(user);
                        }
                    }
                }
            }
            $timeout(function () {
                $scope.scrollToBottom();
            }); 

        }else{
            console.log("b_rowse event received , but ignored ",data);
        }

    });

    socket.on('web_structure', function (data) {
        $scope.web_structure_list_level_1 = [];
        for (var _i3 in data) {
            $scope.web_structure_list_level_1.push({ "title": _i3, "list": data[_i3] });
        }
        var compare = function compare(a, b) {
            if (a["list"].length > b["list"].length) return -1;else return 1;
        };
        $scope.web_structure_list_level_1.sort(compare);
        /*
         let get_brands = function(){
         if($scope.filters!=undefined){
         for(let i in $scope.filters){
         if($scope.filters[i]["type"]=="brand"){
         $scope.brands = $scope.filters[i]["list"]
         }
         }
         }
         }
         */
    });
    //This array contains the benefits which are to be added to $scope.applied_benefits when the apply button is clicked
    $scope.benefits_to_be_pushed = [];
    $scope.benefits_to_be_removed = [];

    /*
     This function takes two arguments, benefit and flag and asks the back-end for
     new product list with updated benefits.
     Benefit param contains the benefit object of the the benefit to be removed/added
     Structure -> benefit = {"value" : <<benefit value>>, "display_name" : <<benefit display value>>}
     flag param contains true or false, where
     true -> add benefit
     false -> remove benefit
     */
    //        added on 5/23/17


    $scope.setBrandLetter = function (letter) {

        $scope.brandLetter = letter;
    };
    //end
    $scope.calc_rem = function () {
        console.log('total', $scope.total_items);
        //alert();
        console.log('prod len', $scope.products_list.length);
        $scope.remining = Math.abs($scope.total_items - $scope.products_list.length);
    };

    $scope.update_applied_benefits = function (benefit, flag) {
        //Remove benefit and update product list
        if (!flag) {
            console.log("removing benefit");
            console.log($scope.active_bc);
            $scope.showload = 1;
            for (var _i4 in $scope.applied_benefits) {
                if ($scope.applied_benefits[_i4].value === benefit.value) $scope.applied_benefits.splice(_i4, 1);
            }
            var _data = {};
            _data["session_id"] = $scope.session_id;
            _data["device_id"] = $scope.device_id;
            _data["user_name"] = $scope.currentUser;
            _data["type"] = "remove";
            _data["benefit_to_be_removed"] = benefit;
            console.log("Removing Benefit: ", JSON.stringify(_data));
            console.log($scope.active_bc);
            socket.emit('update_products', JSON.stringify(_data));
        }

        //Update temporary benefit array
        else {
            //Add benefit to temp array
            if (document.getElementById(benefit.value).checked) {
                if ($scope.benefits_to_be_pushed.indexOf(benefit) === -1) {
                    $scope.benefits_to_be_pushed.push(benefit);
                    if ($scope.benefits_to_be_removed.indexOf(benefit) != -1) {
                        $scope.benefits_to_be_removed.splice($scope.benefits_to_be_removed.indexOf(benefit), 1);
                    }
                }
            } else {
                if ($scope.benefits_to_be_removed.indexOf(benefit) === -1) {
                    $scope.benefits_to_be_removed.push(benefit);
                    if ($scope.benefits_to_be_pushed.indexOf(benefit) != -1) {
                        $scope.benefits_to_be_pushed.splice($scope.benefits_to_be_pushed.indexOf(benefit), 1);
                    }
                }
            }
        }
    };

    //Invoked on clicking the apply button in add more benefits modal box.
    $scope.apply_benefits = function () {
        if ($scope.benefits_to_be_removed.length > 0 || $scope.benefits_to_be_pushed.length > 0) {
            for (var _i5 in $scope.benefits_to_be_pushed) {
                if ($scope.applied_benefits.indexOf($scope.benefits_to_be_pushed[_i5]) === -1) $scope.applied_benefits.push($scope.benefits_to_be_pushed[_i5]);
            }
            for (var _i6 in $scope.benefits_to_be_removed) {
                var _j = $scope.applied_benefits.indexOf($scope.benefits_to_be_removed[_i6]);
                if (_j != -1) $scope.applied_benefits.splice(_j, 1);
            }
            var _data2 = {};
            _data2["session_id"] = $scope.session_id;
            _data2["device_id"] = $scope.device_id;
            _data2["user_name"] = $scope.currentUser;
            _data2["type"] = "add_more_benefits";
            _data2["benefit_to_be_removed"] = $scope.benefits_to_be_removed;
            _data2["benefit_to_be_added"] = $scope.benefits_to_be_pushed;
            console.log(_data2);
            socket.emit('update_products', JSON.stringify(_data2));
            $scope.close_add_more_benefits();
            $scope.showload = 1;
        }
    };

    //Close modal window, clear temporary arrays
    $scope.close_add_more_benefits = function () {
        $scope.show_all_benefits = 0;
        $scope.benefits_to_be_pushed = [];
        $scope.benefits_to_be_removed = [];
    };

    $scope.check_if_checkbox_checked = function (id) {
        if (document.getElementById(id).checked) return true;
        return false;
    };
    //Initialising the active tab in add more benefits modal box to first tab at start
    $scope.active_benefit_index = 0;

    //This function takes the index of the clicked benefit tab from the front end and changes the active_benefit_index value so that tab changes
    $scope.set_active_benefit_index = function (index) {
        $scope.active_benefit_index = index;
    };

    //Checks whether a benefits in all benefits is present in applied_benefits or benefits_to_be_pushed array
    $scope.check_if_benefit_applied = function (benefit_value) {
        for (var _i7 in $scope.applied_benefits) {
            if ($scope.applied_benefits[_i7].value === benefit_value) {
                return 1;
            }
        }
        for (var _i8 in $scope.benefits_to_be_pushed) {
            if ($scope.benefits_to_be_pushed[_i8].value === benefit_value) {
                return 1;
            }
        }
        return 0;
    };

    //Removes all benefits of a particular type from the applied_benefits and benefits_to_be_pushed array
    $scope.clear_benefits_based_on_type = function (benefits) {
        for (var _i9 in benefits) {
            for (var _j2 in $scope.applied_benefits) {
                if (benefits[_i9].value === $scope.applied_benefits[_j2].value) {
                    $scope.applied_benefits.splice(_j2, 1);
                    $scope.benefits_to_be_removed.push(benefits[_i9]);
                }
            }
            for (var _j3 in $scope.benefits_to_be_pushed) {
                if (benefits[_i9].value === $scope.benefits_to_be_pushed[_j3].value) {
                    $scope.benefits_to_be_pushed.splice(_j3, 1);
                }
            }
        }
        $scope.apply_benefits();
    };

    $scope.postMesg = function (message) {
        clearTimeout($scope.suggestion_timer);
        $scope.show_autocomplete_list = 0;
        $scope.search = message;
        //If else condition added for showing UA form after first query if UA form has not yet been submitted
        if ($scope.first_query_sent == 1 || ($scope.ua_form_submitted == 1 && $scope.bc_form_submitted == 1)) {
            console.log("if+++");
            console.log($scope.chat_callback_data);
            if($scope.chat_callback_data.length>0){
                $scope.chat_callback_data = [];
                force_request = 1;
            }
            var _data3 = {};
            _data3["user_type"] = "chat";
            _data3["session_id"] = $scope.session_id;
            _data3["device_id"] = $scope.device_id;
            _data3["user_name"] = $scope.currentUser;
            _data3["type"] = "message";
            _data3["message"] = message;
            _data3["age"] = $scope.ua_age;
            _data3["height"] = $scope.ua_height;
            _data3["body_shape"] = $scope.ua_bodyshape;
            _data3["skin_color"] = $scope.ua_skintone;
            _data3["body_concerns"] = $scope.active_bc;
            console.log(_data3);
            var user = {};
            user.type = 'message';
            user.username = $scope.currentUser;
            user.message = message;
            user.date = new Date().getTime();
            user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
            $scope.users.push(user);
            $scope.resultCame = 0;
            console.log("emmiting user_message 1 ",_data3);
            socket.emit('user message', JSON.stringify(_data3));
            console.log("Sent");
            // $scope.inspiration_selected="false;"
            $scope.message = "";
            if (_data3["show_message"] == true) $scope.ref = 0;
            //3rd march
            $scope.inspiration_tiles = undefined;
            $scope.first_query_sent = 1;
            $scope.scrollToBottom();
        } else {
            console.log("else+++");
            if (message != '' && message != undefined) {
                var user = {};
                var _data4 = {};
                _data4["user_type"] = "chat";
                _data4["session_id"] = $scope.session_id;
                _data4["device_id"] = $scope.device_id;
                _data4["user_name"] = $scope.currentUser;
                _data4["type"] = "message";
                _data4["message"] = message;
                _data4["age"] = $scope.ua_age;
                _data4["height"] = $scope.ua_height;
                _data4["body_shape"] = $scope.ua_bodyshape;
                _data4["skin_color"] = $scope.ua_skintone;
                _data4["body_concerns"] = $scope.active_bc;
                user.type = 'message';
                user.username = $scope.currentUser;
                user.message = message;
                user.date = new Date().getTime();
                user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
                $scope.ini_users.push(user);
                console.log("emmiting user_message 2 ",_data4);
                socket.emit('user message', JSON.stringify(_data4));
                console.log($scope.ini_users);
                $scope.message = "";
                if (_data4["show_message"] == true) $scope.ref = 0;
                _data4["message"] = "";
            }
            $timeout(function () {
                $scope.showtype = 1;
                if (data["show_message"] == true) $scope.ref = 0;
                $scope.scrollToBottom();
                $timeout(function () {
                    $scope.showtype = 0;
                    $scope.first_query_sent = 1;
                    $timeout(function () {
                        $scope.scrollToBottom();
                    }, 300);
                }, 500);
            }, 300);
        }
        
        $scope.UndoTag();
        
    };


    $scope.set_bc_prop = function (value) {
        if (!$scope.inspirations_dir) $scope.ref = 1;

        if ($scope.active_bc.indexOf(value) == -1) {
            $scope.active_bc.push(value);
        } else {
            $scope.active_bc.splice($scope.active_bc.indexOf(value), 1);
        }
    };

    $scope.check_bc_active = function (value) {
        if ($scope.active_bc.indexOf(value) == -1) {
            return false;
        } else {
            return true;
        }
    };

    $scope.send_bc_prop_nothing = function () {
        console.log('Sending Body Concerns - Nothing');
        $scope.active_bc = [];
        $localStorage.active_bc = $scope.active_bc;
        $scope.send_bc_prop();
    };

    $scope.second_form_submitted = false ; /* <-- veriable created by chinmesh on 07/06/2017*/
    $scope.callback_cache = [] ;   
    $scope.send_bc_prop = function () {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "profile_benefits";

        $scope.offcanvas_show_edit = 0;
        $scope.offcanvas_show_profile = 1;
        var data = {};
        data["user_type"] = type;
        data["message"] = $routeParams.search;
        data["session_id"] = $scope.session_id;
        data["device_id"] = $scope.device_id;
        data["user_name"] = $scope.currentUser;
        data["age"] = $scope.ua_age;
        data["height"] = $scope.ua_height;
        data["body_shape"] = $scope.ua_bodyshape;
        data["skin_color"] = $scope.ua_skintone;
        data["body_concerns"] = $scope.active_bc;
        data["url"] = true;

        console.log("Body concerns", data);
        console.log("emmiting user_message 3 ",_data7);
        socket.emit('user message', JSON.stringify(data));

        $localStorage.active_bc = $scope.active_bc;

        if (!$scope.show_overlay) {
            console.log("here");
            $scope.showtype = 1;
            $timeout(function () {
                $scope.scrollToBottom();
            }, 500);
            $timeout(function () {
                $scope.showtype = 0;
                $scope.show_bc_edit = 1;
                $timeout(function () {
                    $scope.scrollToBottom();
                }, 500);
                if ($scope.ua_form_submitted == 1) {
                    $scope.showtype = 1;
                    $timeout(function () {
                        $scope.scrollToBottom();
                    }, 500);
                    $timeout(function () {
                        $scope.showtype = 0;
                        while ($scope.chat_callback_data.length > 0) {
                            var _data5 = $scope.chat_callback_data.pop();
                            $scope.callback_cache=_data5;
                            console.log("data");
                            console.log(_data5);
                            if ($rootScope.query != 'women' && $scope.first_time_heading) {
                                if ($scope.question == undefined) {
                                    $scope.headings = $rootScope.query.charAt(0).toUpperCase() + $rootScope.query.substr(1).toLowerCase() + ' -';
                                    $scope.temp_headings = $scope.headings;
                                } else {
                                    $scope.headings = $scope.question + ' -';
                                    $scope.temp_headings = $scope.headings;
                                }
                                $scope.first_time_heading = 0;
                            }
                            if (_data5.type == "text") {
                                var user = {};
                                user.username = 'Selekt';
                                user.message = _data5.message;
                                user.date = new Date().getTime();
                                user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
                                $scope.latestMesg = user;
                                $scope.ini_users.push($scope.latestMesg);
                            } else if (_data5.type == "multi_select") {
                                $scope.inspiration_tiles = [];
                                var title = _data5.title;
                                var options = _data5.options;
                                user.username = 'Selekt';
                                user.message = _data5.text;
                                user.date = new Date().getTime();
                                user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
                                $scope.users.push(user);
                                $scope.multi_select = _data5.options;
                                $localStorage.multi_select = _data5.options;
                            } else if (_data5.type == "single_select") {
                                $scope.multi_select = [];
                                var user = {};
                                user.username = 'Selekt';
                                user.message = _data5.text;
                                user.date = new Date().getTime();
                                user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
                                $scope.users.push(user);
                                var title = _data5.title;
                                $scope.inspiration_tiles = _data5.options;
                                $localStorage.inspiration_tiles = _data5.options;
                                var options = _data5.options;
                            }
                            $localStorage.users = $scope.users;
                        }
                        if ($scope.bc_form_submitted == 0) {
                            var message = $scope.ini_users[$scope.ini_users.length - 1].message;
                            if (message[0] != 'W') {
                                $scope.bc_form_submitted = 1;
                                $localStorage.bc_form_submitted = 1;
                                var user = {};
                                user.type = 'message';
                                user.username = $scope.currentUser;
                                user.message = message;
                                user.date = new Date().getTime();
                                user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
                                var user2 = $scope.users.pop();
                                $scope.users.push(user);
                                $scope.users.push(user2);
                            }
                        }
                        $timeout(function () {
                            $scope.scrollToBottom();
                        }, 500);
                        $scope.bc_form_submitted = 1;
                        $localStorage.bc_form_submitted = 1;
                    }, 2000);
                }
            }, 2000);
        }
        console.log($scope.showtype);
          $scope.second_form_submitted = true ;/* <-- veriable created by chinmesh on 07/06/2017*/
       
    };
    $scope.ref = 0;
     $scope.first_form_submitted = false ; 
    $scope.send_ua_prop = function () {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "profile_benefits";

        $scope.offcanvas_show_edit = 0;
        $scope.offcanvas_show_profile = 1;

        var data = {};
        data["user_type"] = type;
        data["message"] = $routeParams.search;
        data["session_id"] = $scope.session_id;
        data["device_id"] = $scope.device_id;
        data["user_name"] = $scope.currentUser;
        data["age"] = $scope.ua_age;
        data["height"] = $scope.ua_height;
        data["body_shape"] = $scope.ua_bodyshape;
        data["skin_color"] = $scope.ua_skintone;
        data["body_concerns"] = $scope.active_bc;
        data["url"] = true;

        console.log("User attributes", data);
        console.log("emmiting user_message 4 ",_data7);
        socket.emit('user message', JSON.stringify(data));

        $localStorage.ua_form_submitted = 1;
        $scope.ua_form_submitted = 1;
        $localStorage.ua_age = $scope.ua_age;
        $localStorage.ua_height = $scope.ua_height;
        $localStorage.ua_bodyshape = $scope.ua_bodyshape;
        $localStorage.ua_skintone = $scope.ua_skintone;

        if (!$scope.show_overlay) {
            console.log("here");
            $scope.showtype = 1;
            $timeout(function () {
                $scope.scrollToBottom();
            }, 500);
            $timeout(function () {
                $scope.show_type = 0;
                $scope.show_ua_edit = 1;
                $timeout(function () {
                    $scope.scrollToBottom();
                }, 500);
                console.log("Pre if", $localStorage.bc_form_submitted, $scope.bc_form_submitted);
                if ($localStorage.bc_form_submitted != 1 || $localStorage.bc_form_submitted == undefined) {
                    console.log("Post if");
                    $scope.showtype = 1;
                    $location.hash('bottom');
                    $anchorScroll();
                    $location.hash('');
                    $location.replace();
                    $timeout(function () {
                        $scope.showtype = 0;
                        $scope.show_bc_form = 1;
                        $timeout(function () {
                            $scope.scrollToBottom();
                        }, 500);
                    }, 500);
                }
                if ($scope.bc_form_submitted === 1) {
                    $scope.showtype = 1;
                    $timeout(function () {
                        $scope.scrollToBottom();
                    }, 500);
                    $timeout(function () {
                        $scope.showtype = 0;
                        while ($scope.chat_callback_data.length > 0) {
                            var _data6 = $scope.chat_callback_data.pop();
                            if ($rootScope.query != 'women' && $scope.first_time_heading) {
                                if ($scope.question == undefined) {
                                    $scope.headings = $rootScope.query.charAt(0).toUpperCase() + $rootScope.query.substr(1).toLowerCase() + ' -';
                                    $scope.temp_headings = $scope.headings;
                                } else {
                                    $scope.headings = $scope.question + ' -';
                                    $scope.temp_headings = $scope.headings;
                                }
                                $scope.first_time_heading = 0;
                            }
                            if (_data6.type == "text") {
                                var user = {};
                                user.username = 'Selekt';
                                user.message = _data6.message;
                                user.date = new Date().getTime();
                                user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
                                $scope.latestMesg = user;
                                $scope.ini_users.push($scope.latestMesg);
                            } else if (_data6.type == "multi_select") {
                                $scope.inspiration_tiles = [];
                                var title = _data6.title;
                                var options = _data6.options;
                                user.username = 'Selekt';
                                user.message = _data6.text;
                                user.date = new Date().getTime();
                                user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
                                $scope.users.push(user);
                                $scope.multi_select = _data6.options;
                                $localStorage.multi_select = _data6.options;
                            } else if (_data6.type == "single_select") {
                                $scope.multi_select = [];
                                $scope.showtype = 1;
                                var user = {};
                                user.username = 'Selekt';
                                user.message = _data6.text;
                                user.date = new Date().getTime();
                                user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
                                $scope.users.push(user);
                                var title = _data6.title;
                                $scope.inspiration_tiles = _data6.options;
                                $localStorage.inspiration_tiles = _data6.options;
                                var options = _data6.options;
                            }
                            $localStorage.users = $scope.users;
                        }
                        /* This case no more occurs. This might re occur if reset ua form function is made available again
                         if ($scope.ua_form_submitted == 0) {
                         $scope.showtype = 0;
                         let message = $scope.ini_users[$scope.ini_users.length - 1].message;
                         if (message[0] != 'W') {
                         $scope.ua_form_submitted = 1;
                         $localStorage.ua_form_submitted = 1;
                         $scope.ini_users.pop();
                         $scope.postMesg(message);
                         }
                         }*/
                        $timeout(function () {
                            $scope.scrollToBottom();
                        }, 500);
                    }, 2000);
                }
            }, 2000);
        }
         $scope.first_form_submitted = true ;    /* <-- veriable created by chinmesh on 07/06/2017*/ 
    };

    $scope.offcanvas_send_ua_and_bc = function () {
        $scope.offcanvas_show_edit = 0;
        $scope.offcanvas_show_profile = 1;
        $scope.send_ua_prop();
    };

    /* dangling if */
    console.log("dangling if reached",$localStorage.ua_form_submitted,$localStorage.bc_form_submitted);
    if ($localStorage.ua_form_submitted == 1 || $localStorage.bc_form_submitted == 1) {
        console.log("IN if condition");
        if ($localStorage.ua_form_submitted === 1 && $localStorage.bc_form_submitted === 1) {
            $scope.ua_age = $localStorage.ua_age;
            $scope.ua_height = $localStorage.ua_height;
            $scope.ua_skintone = $localStorage.ua_skintone;
            $scope.ua_bodyshape = $localStorage.ua_bodyshape;
            $scope.ua_form_submitted = 1;
            $scope.active_age = $scope.ua_age;
            $scope.active_height = $scope.ua_height;
            $scope.active_bodyshape = $scope.ua_bodyshape;
            $scope.active_skintone = $scope.ua_skintone;
            $scope.show_ua = 1;
            $scope.show_ua_form = 0;
            $scope.show_ua_edit = 0;
            $scope.active_bc = $localStorage.active_bc;
            $scope.bc_form_submitted = 1;
            $scope.show_bc = 1;
            $scope.show_bc_form = 0;
            $scope.show_bc_edit = 0;
            $scope.show_bc_edit = 0;
            
            if($localStorage.search != $routeParams.search){
                $scope.send_ua_prop("chat");
            }else{
                console.log("setting localStorage.search to '', 1 ");
                $localStorage.search = "" ;
            }

            $scope.view_profile_message = 1;
        } else if ($localStorage.ua_form_submitted === 1) {
            $scope.ua_age = $localStorage.ua_age;
            $scope.ua_height = $localStorage.ua_height;
            $scope.ua_skintone = $localStorage.ua_skintone;
            $scope.ua_bodyshape = $localStorage.ua_bodyshape;
            $scope.ua_form_submitted = 1;
            $scope.active_age = $scope.ua_age;
            $scope.active_height = $scope.ua_height;
            $scope.active_bodyshape = $scope.ua_bodyshape;
            $scope.active_skintone = $scope.ua_skintone;
            $scope.show_ua = 1;
            $scope.show_ua_form = 0;
            
            if($localStorage.search == $routeParams.search){
                $scope.send_ua_prop("chat");
                $localStorage.search = "" ;
            }else{
                console.log("setting localStorage.search to '', 2 ");
                
            }

            $scope.show_ua_edit = 0;
            if (!$localStorage.bc_form_submitted === 1) $scope.show_bc_form = 1;
        } else if ($localStorage.bc_form_submitted === 1) {
            $scope.active_bc = $localStorage.active_bc;
            $scope.bc_form_submitted = 1;
            $scope.show_bc = 1;
            $scope.show_bc_form = 0;
            $scope.show_bc_edit = 0;
            if($localStorage.search == $routeParams.search){
                $scope.send_bc_prop("chat");
                $localStorage.search = "" ;
            }
            else{
                console.log("setting localStorage.search to '', 3 ");
                
            }
            $scope.show_bc_edit = 0;
            if (!$localStorage.ua_form_submitted === 1) $scope.show_ua_form = 1;
        }
    } else {
        console.log("IN else condition");        
        $scope.ua_age = "";
        $scope.ua_height = "";
        $scope.ua_skintone = "";
        $scope.ua_bodyshape = "";
        $scope.ua_form_submitted = 0;
        $scope.active_bc = [];
        $scope.bc_form_submitted = 0;
        $scope.show_ua_form = 1;
        var _data7 = {};
        _data7["user_type"] = "website";
        _data7["message"] = $routeParams.search;
        _data7["session_id"] = $scope.session_id;
        _data7["device_id"] = $scope.device_id;
        _data7["user_name"] = $scope.currentUser;

        if($localStorage.search == $routeParams.search){
            console.log("dangling else if");
            $localStorage.search = "" ;
        }else{
            console.log("emmiting user_message 5 ",_data7);
            socket.emit('user message', JSON.stringify(_data7));
        }
    }

    /*
    $timeout(function () {
            console.log("setting localStorage.search now to '' ");
            $localStorage.search = "" ;
    }, 3000);
    */

    $scope.reset_ua = function () {
        $scope.ua_age = "";
        $scope.ua_height = "";
        $scope.ua_bodyshape = "";
        $scope.ua_skintone = "";
        $localStorage.ua_age = "";
        $localStorage.ua_height = "";
        $localStorage.ua_bodyshape = "";
        $localStorage.ua_skintone = "";
        $scope.active_age = "";
        $scope.active_height = "";
        $scope.active_bodyshape = "";
        $scope.active_skintone = "";
        $scope.first_query_sent = 1;
        //$localStorage.bc_form_submitted=0;
        $timeout(function () {
            $scope.scrollToBottom();
        });
    };

    $scope.edit_ua_and_bc = function () {
        $scope.first_query_sent = 1;
        $scope.offcanvas_show_edit = 1;
        $scope.offcanvas_show_profile = 0;
        $scope.show_overlay = 1;
        $localStorage.bc_form_submitted = 0;
        var i = document.getElementById('offcanvas_toggle');
        i.click();
    };

    $scope.reset_bc = function () {
        $scope.active_bc = [];
        $localStorage.active_bc = [];
        $scope.first_query_sent = 1;
        $timeout(function () {
            $scope.scrollToBottom();
        });
    };

    $scope.reset_ua_and_bc = function () {
        $scope.reset_ua();
        $scope.reset_bc();
    };

    /* Used for showing edit body concern form in chat.
     $scope.edit_bc = function() {
     $scope.first_query_sent = 1;
     $scope.show_bc = 0;
     $scope.show_bc_edit = 0;
     $scope.show_bc_form = 1;
     $scope.bc_form_submitted = 0;
     $localStorage.bc_form_submitted = 0;
     $timeout(function () {
     $location.hash('bc_form');
     $anchorScroll();
     $location.hash('');
     $location.replace();
     });
     }
     */
    $scope.set_ua_prop = function (ua_value) {
        var ua_type = ua_value.substring(0, ua_value.indexOf("_"));
        var value = ua_value.substring(ua_value.indexOf("_") + 1, ua_value.length);
        $scope["ua_" + ua_type] = value;
        $scope["active_" + ua_type] = value;
    };

    $scope.set_input_value = function (input_value) {
        $scope.message = input_value;
    };

    $scope.ua_form_checked = function (ua_value) {
        var ua_type = ua_value.substring(0, ua_value.indexOf("_"));
        var value = ua_value.substring(ua_value.indexOf("_") + 1, ua_value.length);
        if ($scope["ua_" + ua_type] === value) {
            console.log("checked");
            return true;
        }
        return false;
    };
    $scope.createRoom = function (data) {
        $scope.currentUser = data.username;
        socket.emit('createroom', data);
    };
    $scope.joinRoom = function (data) {};
    $scope.hideWave = function () {
        // console.log("wave hided");
    };
    $scope.show_loader =0;
    $scope.showMoreProducts = function () {
        $scope.showload = 0;
        $scope.show_loader =1;
        $scope.remining=0;
        if ($scope.textTag == 1) {
            console.log('in show_more if');
            $scope.webpage_num++;
            var pre_chat = '{"message" :"' + $routeParams.search + '", "session_id" :"' + $scope.session_id + '","device_id"  : "' + $scope.device_id + '","user_name"  :"' + $scope.currentUser + '" ,"from" : ' + $scope.webpage_num + '}';
            //  var pre_chat = '{"session_id" :"'+$scope.session_id+'","message" :"'+$rootScope.query.replace(/-/g," ")+'"}';
            socket.emit('web', pre_chat);
            console.log("prodo len", $scope.products_list.length);
        } else {
            console.log("prodo len", $scope.products_list.length);
            var page_no = $scope.current_page;
            $scope.current_page++;
            page_no++;
            data = '{"session_id": "' + $scope.session_id + '","device_id"  :"' + $scope.device_id + '","user_name"  :"' + $scope.currentUser + '","page_no" :' + page_no + '}';
            socket.emit('show_more', data);
            console.log('in show_more else' + data);
        }
    };
    $scope.postDropdowns = function (element) {
        if (!$scope.inspirations_dir) $scope.ref = 1;
        if (!$scope.ref) $scope.showload = 1;
        console.log('showload at .postDropdowns>' + $scope.showload);
        //console.log('in posting dropdowns ',element);
        //data = '{"session_id": "' + $scope.session_id + '","device_id"  :  "msdnlkafdnoacsndoahesh","user_name"  :"' + $scope.currentUser + '", "type" : "answer" ,"keys" :"' + element + '"}';

        var array_key = [];
        array_key[0] = element;
        var data = {};
        data["session_id"] = $scope.session_id;
        data["device_id"] = $scope.device_id;
        data["user_name"] = $scope.currentUser;
        data["type"] = "answer";
        data["keys"] = array_key;

        data["age"] = $scope.ua_age;
        data["height"] = $scope.ua_height;
        data["body_shape"] = $scope.ua_bodyshape;
        data["skin_color"] = $scope.ua_skintone;
        data["body_concerns"] = $scope.active_bc;
        console.log(data);
        var user = {};
        user.username = $scope.currentUser;
        var message = "";
        for (var k in $scope.inspiration_tiles) {
            //console.log('key ##',JSON.stringify($scope.inspiration_tiles[k].key));
            if ($scope.inspiration_tiles[k].key == element) message = $scope.inspiration_tiles[k].value;
        }
        user.type = 'answer';
        user.message = message;
        user.message_key = element;
        user.date = new Date().getTime();
        user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
        $scope.users.push(user);
        console.log("emmiting user_answers dropdowns ",data);
        socket.emit('user answers', JSON.stringify(data));
        $scope.inspiration_selected = undefined;
        $scope.results = [];
        $scope.inspiration_tiles = [];
        $("html, body").animate({ scrollTop: 0 }, 10);
        
        $scope.UndoTag();
    };
    $scope.postMultiSelect = function () {

        console.log("In multi select post");
        var keys = $scope.multi_select_selected;
        $scope.multiselect_keys = keys;
        var message = "You have selected the following";
        for (var j in keys) {
            for(var k in $scope.multi_select){
                if($scope.multi_select[k].key===keys[j]){
                    message += "\n" + $scope.multi_select[k].value;
                    console.log('multiselect values' + $scope.multi_select[k].value);
                    break;
                }
            }
        }
        if (keys.length > 0) {
            if (!$scope.ref) $scope.showload = 1;
            console.log('showload at .postMultiSelect>' + $scope.showload);
            var data2 = {};
            data2["session_id"] = $scope.session_id;
            data2["device_id"] = $scope.device_id;
            data2["user_name"] = $scope.currentUser;
            data2["type"] = "multi_select_answer";
            data2["keys"] = keys;

            data2["age"] = $scope.ua_age;
            data2["height"] = $scope.ua_height;
            data2["body_shape"] = $scope.ua_bodyshape;
            data2["skin_color"] = $scope.ua_skintone;
            data2["body_concerns"] = $scope.active_bc;
            console.log(data2);
            data2 = JSON.stringify(data2);
            var user = {};
            user.username = $scope.currentUser;
            user.type = 'answer';
            user.message = message;
            user.message_key = keys;
            user.date = new Date().getTime();
            user.image = 'https://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
            $scope.users.push(user);
            console.log("emmiting user_answers multiselect",data);
            socket.emit('user answers', data2);
            $scope.results = [];
            $scope.multi_select = [];
            $("html, body").animate({ scrollTop: 0 }, 10);
        }
        $scope.multi_select_selected = [];
        $scope.UndoTag();
    };
    $scope.pushToArray = function (value) {
        $scope.results[0] = value;
        //console.log('pushed>>', $scope.results);
    };
    $scope.showNext = function (value) {
        switch (value) {
            case 'name':
            {
                $scope.showName = 1;
                $scope.showHeight = 0;
                $scope.showColor = 0;
                break;
            }
            case 'color':
            {
                $scope.showName = 0;
                $scope.showHeight = 0;
                $scope.showColor = 1;
                break;
            }
            case 'height':
            {
                $scope.showName = 0;
                $scope.showHeight = 1;
                $scope.showColor = 0;
                break;
            }
            default:
                $scope.chat = 1;
        }
    };

    $scope._show_more = 0;
    $scope.show_more_less = "▼";
    $scope.showMore = function () {
        if ($scope.show_more_less == '▼') {
            $scope.show_more_less = "▲";
            $scope._show_more = 1;
        } else {
            $scope.show_more_less = "▼";
            $scope._show_more = 0;
        }
    };


        /*modified by chinmesh on 13/06/17 */
    $scope.setProductPage = function (x,event) {

        console.log("current scroll y ",$window.scrollY);
        console.log("current scroll x ",$window.scrollX);

        console.log(event);
        event.preventDefault();
        console.log("Setting product page");
        console.log(x);
        var myEl = angular.element(document.querySelector('#dialogs'));
        myEl.removeAttr('ng-bootbox-custom-dialog');
        $rootScope.product_page = x;
        $rootScope.product_page['image'] = x.style_image.search.imageURL;
        
        //alert('setting product page'+$scope.productline_name);

        //$localStorage['search'] = $scope.productline_name ;
        $localStorage['search'] = $rootScope.absUrls.split('/')[4] ;
        console.log("LOLOLOLOLOLOLO ",$localStorage['search']);
        var data = '{"session_id" :"' + $scope.session_id + '","device_id"  :"' + $scope.device_id + '","user_name"  : "User ","type" : "message" ,"message" :"clear" }';
        $localStorage['chat_session_data'] = data ;    
        $localStorage['page_scroll_x'] = $window.scrollX ;
        $localStorage['page_scroll_y'] = $window.scrollY ;

        console.log($scope.users,$scope.ini_users);

        $localStorage['users'] = $scope.users ;
        $localStorage['ini_users'] = $scope.ini_users ;
        $localStorage.session_id = $scope.session_id;

        //Web structure variables
        $localStorage.web_structure_show_brands = $scope.web_structure_show_brands ;
        $localStorage.web_structure_show_factors = $scope.web_structure_show_factors;
        $localStorage.show_foot =  $scope.show_foot ;
        
        //UA FORM VARIABLES
        $localStorage.show_ua  = $scope.show_ua ;
        $localStorage.show_ua_form = $scope.show_ua_form;
        $localStorage.ua_form_submitted =  $scope.ua_form_submitted;
        $localStorage.show_ua_edit = $scope.show_ua_edit ;

        $localStorage.show_bc = $scope.show_bc ;
        $localStorage.show_bc_form = $scope.show_bc_form  ;
        $localStorage.bc_form_submitted = $scope.bc_form_submitted ;
        $localStorage.show_bc_edit = $scope.show_bc_edit ;
        $localStorage.multi_select_selected = $scope.multi_select_selected;
        
        $localStorage.products_list = $scope.products_list ;


        $localStorage.temp_list = $scope.temp_list ;
        $localStorage.temp_headings = $scope.temp_headings;
        $localStorage.temp_total_items = $scope.temp_total_items;

        $localStorage.chat_callback_data = $scope.chat_callback_data ;
        $localStorage.first_query_sent = $scope.first_query_sent ;

        //$localStorage.productline_name = $scope.productline_name ;

        timer = $timeout(function () {
            $window.location.href = $rootScope.website + '/product/'+$scope.productline_name+'/'+x._id;
        }, 2000);
        
    };


    $rootScope.changeImage = function (image) {
        $rootScope.product_page['image'] = image;
    };
       $scope.includeFilter = function (value, type, tag) {
        console.log('in includeFilter>');
        var a = 0,
            b = 0;
        switch (tag) {
            case 1:
                a = 0;
                b = 1;
                break;
            case 2:
                a = 1;
                b = 0;
                break;
            case 3:
                a = 1;
                b = 1;
                break;
        }
        var name = '$scope.' + type + 'Includes';
        // console.log('in adding', name);
        if (a) {
            // console.log('adding>');
            var i = $.inArray(value, eval(name));
            if (i > -1) {
                eval(name).splice(i, 1);
                $scope.all_filters_arrays[name] = eval(name);
            } else {
                eval(name).push(value);

                $scope.all_filters_arrays[name] = eval(name);
            }
            // console.log(JSON.stringify($scope.all_filters_arrays));
            $localStorage.all_filters_arrays = $scope.all_filters_arrays;
            /*
            {
                
            console.log('sending.');
            for (var index in $scope.filters_list) {
                if ($scope.filters_list[index].key === type) {
                    $scope.filters_list[index]['values'] = eval(name);
                }
            }
            var temp_filter_list = $scope.filters_list;
            var final_filters = [];
            for (var i in temp_filter_list) {
                if (temp_filter_list[i].values.length != 0) {
                    var json = {};
                    json['key'] = temp_filter_list[i].key;
                    json['values'] = temp_filter_list[i].values;
                    final_filters.push(json);
                }
            }
            data = '{ "session_id" :"' + $scope.session_id + '","device_id"  :"' + $scope.device_id + '","user_name"  :"' + $scope.currentUser + '", "type": "filters", "filter_list" :' + JSON.stringify(final_filters) + ' }';
            socket.emit('update_filters', data);
            console.log('after sent filters>', data);
            }
            */
        }
        if (b) {
            console.log('sending.');
            for (var index in $scope.filters_list) {
                if ($scope.filters_list[index].key === type) {
                    $scope.filters_list[index]['values'] = eval(name);
                }
            }
            var temp_filter_list = $scope.filters_list;
            var final_filters = [];
            for (var i in temp_filter_list) {
                if (temp_filter_list[i].values.length != 0) {
                    var json = {};
                    json['key'] = temp_filter_list[i].key;
                    json['values'] = temp_filter_list[i].values;
                    final_filters.push(json);
                }
            }
            data = '{ "session_id" :"' + $scope.session_id + '","device_id"  :"' + $scope.device_id + '","user_name"  :"' + $scope.currentUser + '", "type": "filters", "filter_list" :' + JSON.stringify(final_filters) + ' }';
            socket.emit('update_products', data);
            
            console.log('after sent filters>', data);
            if (value != 'clearAll') {
                $scope.closeSMF();
                $scope.show_all_filters = 0;
                $scope.show_more_search = '';
            }

            $("html, body").animate({ scrollTop: 0 }, 10);
            $scope.showload = 1;
        }
    };
    $scope.filter_expand = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0];
    $scope.filterExpand = function (index) {
        $scope.filter_expand[index] = !$scope.filter_expand[index];
    };
    $scope.popUp = function (mesg) {
        $scope.show_filter = !$scope.show_filter;
        $scope.show_more_popup = $scope.filters[0];
    };
    $scope.showing_more_filters = 0;
    $scope.popUpShowMore = function (more_filters, type, display_name) {
        $scope.show_more_search = '';
        $scope.more_filters = more_filters;
        var temp = [];
        $scope.filter_letters = [];
        for (var index = 0; index < more_filters.length; index++) {
            if (temp.indexOf(more_filters[index].charAt(0)) == -1) {
                if (more_filters[index].charAt(0).charCodeAt(0) > 64 || more_filters[index].charAt(0).charCodeAt(0) < 32) {
                    temp.push(more_filters[index].charAt(0));
                    $scope.filter_letters.push(more_filters[index].charAt(0));
                }
                if (temp.indexOf('@') < 0 && more_filters[index].charAt(0).charCodeAt(0) < 65) {
                    temp.push('@');
                    $scope.filter_letters.push('@');
                }
            }
            temp.push(more_filters[index]);
        }
        $scope.chunk_type_name = type;
        $scope.search_display_name = display_name;
        $scope.chunk_filters = temp;
        $scope.showing_more_filters = 1;
    };
    $scope.getMe = function (value, type) {
        //console.log('type>'+type+'value>'+value);
        var name = '$scope.' + type + 'Includes';
        if (eval(name).indexOf(value)!=-1) return 1;else return 0;
    };
      /* modified by chinmesh on 07/06/2017    */
        $scope.resetChat = function (clear) {
            
            if ($scope.second_form_submitted){
                $scope.show_bc_form = false ;    
            }
            if($scope.first_form_submitted){
                $scope.show_ua_form = false ;
            }
            try{
                    $scope.multi_select[0] = false ;
                    console.log("multiselect_sucess : $scope.multi_select[0] defined and set to false");
            } catch (e) {
                    console.log("multiselect_error : $scope.multi_select[0] not defined yet");
            }            
            if(!$scope.second_form_submitted && !$scope.first_form_submitted){
            $scope.first_query_sent = false ;
            }
            //$window.location.href = $rootScope.website + '/find/women';
            console.log("resetChat");
            console.log($scope.users);

            console.log("ini_users");
            console.log($scope.ini_users);

            console.log("users");
            console.log($scope.users);

            $scope.ini_users = [] ;
            $scope.users = [];
            $localStorage.users = [];
            $scope.inspiration_tiles = [];
            $localStorage.inspiration_tiles = [];
            $scope.remining = 0;    

            var data = '{"session_id" :"' + $scope.session_id + '","device_id"  :"' + $scope.device_id + '","user_name"  : "User ","type" : "message" ,"message" :"clear" }';
            socket.emit('reset', data);

            $("html, body").animate({scrollTop: 0}, 10);
            
            $scope.UndoTag();
        
        };

    $scope.show_all_filters = 0;
    $scope.show_all_benefits = 0;
    $scope.v = 0;
    $scope.setV = function (index) {
        $scope.v = index;
    };
    $scope.closeSMF = function () {
        $scope.showing_more_filters = 0;
        $scope.show_more_search = '';
        // console.log('pop up closed>', $scope.showing_more_filters);
    };
    $scope.filter_values_len = 10;
    $scope.clearAll = function (type) {
        var name = '$scope.' + type + 'Includes = []';
        eval(name);
        $scope.includeFilter('clearAll', type, 1);
    };
    $scope.updateFiltersLen = function () {
        var arr = $filter('filter')($scope.filters[$scope.v].values, $scope.show_more_search);
        $scope.no_of_columns = Math.ceil(arr.length / 10);
    };

    $scope.gotoAnchor = function (x) {
        $anchorScroll.yOffset = 500;
        $anchorScroll("scrollTo_" + x);
        $location.hash('');
        $location.replace();
    };

    $scope.changeRouteTo = function (path) {
        $location.update_path(path, true);
        $rootScope.query = 'white-party-dress';
    };

    $scope.getInspiration = function (id, heading) {
        $scope.showload = 1;

        console.log('showload at .getInspiration>' + $scope.showload);
        $scope.headings = heading;
        var data = '{"type":"inspiration","id":' + id + '}';
        socket.emit('user answers', data);
        $scope.product_list_content_dir = 1;
        $scope.inspirations_dir = 0;
    };

    $scope.showUnderline = function (x) {
        var $ele = angular.element(document.querySelector('.scrollTo_' + x));
        $ele.css('border-bottom', '2px solid #434343');
    };

    $scope.removeUnderline = function (x) {
        var $ele = angular.element(document.querySelector('.scrollTo_' + x));
        $ele.css('border', 'none');
    };

    $scope.gototop = function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
    };

    $scope.categoryPage = function (message, type) {
        $scope.showload = 1;

        console.log('showload at .categories>' + $scope.showload);
        $("html, body").animate({ scrollTop: 0 }, 10);

        var productLine = $scope.productline_name.trim();
        if (type == 'body_shape') {
            if (input) $scope.currently_selected = message.replace(/_/g, " ") + ' shape';
            $scope.user_selected_categories.body_shape = $scope.currently_selected;
        } else if (type == 'age') {
            if (message == '18-27') $scope.currently_selected = 'teenage';else $scope.currently_selected = 'adult';
            $scope.user_selected_categories.age = message;
        } else if (type == 'skin_colour') {
            if (input) $scope.user_selected_categories.skin_color = message.replace(/_/g, " ");
        } else if (type == 'height') {
            if (input) $scope.user_selected_categories.height = message.replace(/_/g, " ");
        } else {
            if (input) $scope.user_selected_categories.occasion = message.replace(/_/g, " ");
        }

        var total_link = productLine;
        for (var prop in $scope.user_selected_categories) {
            if ($scope.user_selected_categories[prop] != '') total_link = total_link + "-" + $scope.user_selected_categories[prop];
        }
        $location.path('/find/' + total_link);
    };

    $scope.hovering = false;
    $scope.prev_hovering = false;

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
            if ($scope.current_hover == 'button' && $scope.prev_hovering != 'button') {
                $scope.hovering = false;
            }
            console.log('in hide>' + $scope.hovering);
        }, 100);
    };

    
    $scope.undo = function () {
        
        
        var count = 0;
        var first_last = {};
        var second_last = {};
        var temp = $scope.users;
        console.log('undo action');
        $scope.chat_callback_data.push($scope.callback_cache);
        for (var x in temp) {
            $scope.inspiration_tiles = [];
            var len = $scope.users.length;
            console.log('x is ' + x + 'len is ' + len);
            // console.log('multiselect values'+$scope.multi_select.value);
            console.log('curent_item>' + $scope.users[len - 1].username + 'count>' + count);
            if ($scope.users[len - 1].username == 'User') {

                console.log('in if>');
                ++count;
                if (count == 1) {
                    first_last = $scope.users.pop();
                    console.log('first_last>' + JSON.stringify(first_last));
                }
                if (count == 2) {
                    second_last = $scope.users[len - 1];
                    console.log('second_last>' + JSON.stringify(second_last));
                    break;
                }
            } else {
                
                if(first_last != null)
                $scope.users.pop();
            }
        }
        var second_last = $scope.users[$scope.users.length - 1];
        var undo_data = {};
        console.log('first_last>' + JSON.stringify(first_last));
                console.log('second_last>' + JSON.stringify(second_last));
        if(second_last!= undefined)
        if(second_last.username != 'user'){
            $scope.users.pop();
        }

        //socket.emit('remove_profile', JSON.stringify(prof_type));
        //console.log('remove_profile>' + JSON.stringify(prof_type));
        undo_data["multiselect_keys"] = $scope.multiselect_keys;
        //undo_data["type"] = "undo";
        undo_data["type_of_question"] = first_last.type;
        if (first_last.type == 'answer') {
            undo_data["user_msg"] = first_last.message_key;
        } else undo_data["user_msg"] = first_last.message;
        if (second_last != undefined) {
            undo_data["prev_question_type"] = second_last.type;
            if (second_last.type == 'answer') {
                undo_data["prev_user_msg"] = second_last.message_key;
            } else undo_data["prev_user_msg"] = second_last.message;
        }
        undo_data["session_id"] = $scope.session_id;

        console.log('data_sent>' + JSON.stringify(undo_data));
        if( undo_data.prev_user_msg==null || undo_data.prev_user_msg=="Welcome to Selekt, share your needs in the following manner\n\n\t1. Jeans\n\t2. Dresses for wedding under 5000\n\t3. White and red dresses for party under 2000")
                {
            data = '{ "session_id" :"' + $scope.session_id + '","device_id"  :"' + $scope.device_id + '" ,"user_name"  :"' + $scope.currentUser + '"}';
            socket.emit('welcome', data);
                }
        socket.emit('undo', JSON.stringify(undo_data));
        $scope.multi_select = [];
        
        $scope.UndoTag();
    };

    $scope.suggestion_timer = 0;
    $scope.show_autocomplete_list = 0;

    $scope.hide_autocomplete_list = function () {
        $timeout(function () {
            $scope.show_autocomplete_list = 0;
        }, 300);
    };

    $scope.click_button_by_id = function (id1, id2) {
        var i1 = document.getElementById(id1);
        var i2 = document.getElementById(id2);
        i1.click();
        $timeout(function () {
            i2.click();
        }, 200);
    };

    $scope.click_button_by_id_2 = function (id1, id2) {
        var i1 = document.getElementById(id1);
        var i2 = document.getElementById(id2);
        i1.click();
        $timeout(function () {
            document.getElementById('offcanvas_toggle').click();
            $timeout(function () {
                i2.click();
            }, 200);
        }, 500);
    };
    //added on 5/23/17
     socket.on('popular searches', function (data) {
         temp_popular_searches = data;
         
         console.log("RECEIVED POPULAR SEARCHES",temp_popular_searches);
    });
    //

    $scope.updateSuggestions = function (message) {
        clearTimeout($scope.suggestion_timer);
        $scope.show_autocomplete_list = 0;
//        var url = 'https://www.selekt.in/selekt/autocomplete';
        var url = 'https://www.prodx.in/selekt/autocomplete'
        $scope.suggestion_timer = setTimeout(function () {
            $scope.show_autocomplete_list = 1;
            $http({
                url: url,
                method: "POST",
                data: { 'message': message }
            }).then(function (response) {
                $scope.chat_suggestions_options = response.data.suggestions[0].highlight;
                $scope.chat_suggestions_heading = response.data.suggestions[1].highlight.charAt(0).toUpperCase() + response.data.suggestions[1].highlight.slice(1);
                $scope.chat_suggestions_understood = response.data.suggestions[2].highlight.charAt(0).toUpperCase() + response.data.suggestions[2].highlight.slice(1);
            }, function (response) {});
        }, 200);
    };

    $scope.check_overlay = function () {
        $timeout(function () {
            if ($scope.show_overlay === 1) {
                document.getElementById('offcanvas_toggle').click();
            }
        }, 500);
    };

    $scope.scrollToBottom = function () {
        var objDiv = document.getElementById("style-1");
        if (objDiv != null) {
            var scrollInterval = setInterval(function () {
                if (Math.floor(objDiv.scrollHeight - objDiv.scrollTop) == objDiv.clientHeight + 1) {
                    clearInterval(scrollInterval);
                } else {
                    objDiv.scrollTop += 1;
                }
            }, 1);
        }
    };
      $scope.UndoTag = function(){
        for(var x in $scope.users)
            {
                console.log("*****>" + JSON.stringify($scope.users[x]));
                if($scope.users[x].username ==  'User')
                {
                $scope.undo_tag = 1;
                break;
                }
                $scope.undo_tag = 0;
                
            }
    };
    $scope.check = function (id) {
        if (!$scope.inspirations_dir) $scope.ref = 1;
        if (id != undefined) {
            id = 'multi_' + id;
            console.log(document.getElementById(id).value);
            console.log(id);
            if ($scope.multi_select_selected.indexOf(document.getElementById(id).value) != -1) {
                $scope.multi_select_selected.splice($scope.multi_select_selected.indexOf(document.getElementById(id).value), 1);
            } else {
                $scope.multi_select_selected.push(document.getElementById(id).value);
            }
        }
    };

    $scope.isChecked = function (id) {
        if (id != undefined) {
            id = 'multi_' + id;
            if ($scope.multi_select_selected.indexOf(document.getElementById(id).value) != -1) return true;
            return false;
        }
    };
}]);

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