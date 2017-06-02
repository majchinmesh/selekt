/**
 * Created by admin on 14-Dec-16.
 */

var app = angular.module( "Search", [] );

app.controller( "Search", [ "$rootScope", '$scope', '$window', 'socket', "$location", "$anchorScroll", "$timeout","$localStorage",
    function( $rootScope, $scope, $window, socket, $location, $anchorScroll, $timeout,$localStorage )
	{
		//alert('resolved data>'+ JSON.stringify(title.title));
    // march 7

    $scope.load = function()
    { 
          if($localStorage.jsondata != null)
          {
          $scope.users = [];
          $scope.users = $localStorage.jsondata;
          $scope.products_list = [];
          $scope.products_list = $localStorage.products_list;
          $scope.session_id = $localStorage.session_id;
          $scope.inspiration_tiles = [];
          $scope.inspiration_tiles = $localStorage.inspiration_tiles;
          console.log('json time >',JSON.stringify($scope.session_id));
          $timeout( function()
            {
              $location.hash( 'bottom' );
              $anchorScroll();
              $location.hash( '' );
              $location.replace();
            },1000 )

          }
          else 
          {
            
		$scope.products_list = [];
            $scope.users = [];
            $scope.inspiration_tiles = [];
          }
    }
    $scope.load();
    //

		$scope.showload = 1;
		$scope.getCnf;
		$scope.showName = 1;
		$scope.showColor = 0;
		$scope.showHeight = 0;
		$scope.chat = 1;
		$scope.displayText = {};
		$scope.inspiration_selected;
		$scope.results = [ "" ];
		var session = Date.now();
		session = session.toString();
		$scope.currentUser = 'User';
		$scope.chatImage = 'pics/chat_background.png';
  
    if($scope.users[0] == undefined){
      
		$scope.session_id = session;
        console.log('users>',$scope.users);
		data = '{"session_id" :"' + $scope.session_id + '","device_id"  :  "msdnlkafdnoacsndoahesh","user_name"  :"' + $scope.currentUser + '"}';
		socket.emit( 'add user', data );
    }
    else
    {
      data = '{"session_id" :"' + $scope.session_id + '","device_id"  :  "msdnlkafdnoacsndoahesh","user_name"  :"' + $scope.currentUser + '"}';
		socket.emit( 'add user', data );
    }
		socket.on( 'connect', function() {} );

		// socket.on( 'updatechat', function( username, data )
		// {
		// 	var user = {};
		// 	user.username = 'user';
		// 	user.message = data;
		// 	user.date = new Date().getTime();
		// 	user.image = 'http://dummyimage.com/250x250/000/fff&text=' + username.charAt( 0 ).toUpperCase();
		// 	$scope.users.push( user );
		// } );
		data = '{"session_id" : "' + $scope.session_id + '","device_id"  :  "msdnlkafdnoacsndoahesh","user_name"  : "user"}';
	$scope.getCnf = 1;
		socket.on( 'bot login', function( data )
		{
			$scope.getCnf = 1;
			//  $scope.session_id= data.sessionId;
			//console.log("Bot login >> ",data)

		} );
		$scope.resultCame = 1;
		socket.on( 'chat', function( data )
		{

			// console.log("Chat >> ",JSON.stringify(data));
			if ( data.type == "text" )
			{
				var user = {};
				user.username = 'Selekt';
				user.message = data.message;
				user.date = new Date().getTime();
				user.image = 'http://dummyimage.com/250x250/000/fff&text=' + user.username.charAt( 0 ).toUpperCase();
				$scope.users.push( user );
				$scope.showload = 0;
			}
			else if ( data.type == "nested_select" )
			{
				var title = data.title;
				var options = data.options;
				// console.log(options);
			}
			else if ( data.type == "single_select" )
			{

				var user = {};
				user.username = 'Selekt';
				user.message = data.text;
				user.date = new Date().getTime();
				user.image = 'http://dummyimage.com/250x250/000/fff&text=' + user.username.charAt( 0 ).toUpperCase();
				$scope.users.push( user );
				var title = data.title;
				$scope.inspiration_tiles = data.options;
        $localStorage.inspiration_tiles = data.options;
				var options = data.options;
				// console.log(options);
				$timeout( function()
				{
					$location.hash( 'bottom' );
					$anchorScroll();
					$location.hash( '' );
					$location.replace();
				} )
			}
			$timeout( function()
			{
				$location.hash( 'bottom' );
				$anchorScroll();
				$location.hash( '' );
				$location.replace();
			} )
      $localStorage.users = $scope.users;
		} );
		socket.on( 'benefits', function( data )
		{
			//console.log("benefit : ",data);

			$scope.sentences = data.sentences;
			$scope.tabular = data.tabular;
			//console.log("sentence>",$scope.sentences );
			$scope.question = data.question;

		} );
		socket.on( 'browse', function( data )
		{
			//console.log("Browse : ",JSON.stringify(data));
      $localStorage.jsondata = $scope.users;
      $localStorage.session_id =  $scope.session_id;
			$scope.resultCame = 1;
			$scope.showload = 0;
			if ( data.type == 'filter_list' )
			{
				$scope.filters = data.options;

				$scope.filters_list = [];
				for ( index in $scope.filters )
				{
					// console.log('type>>',JSON.stringify($scope.filters[index].key)); 
					var filter_array = '$scope.' + $scope.filters[ index ].key + 'Includes = []';
					eval( filter_array );
					var json = {};
					json[ 'key' ] = $scope.filters[ index ].key
					json[ 'values' ] = [];
					$scope.filters_list.push( json );
				}
				console.log( 'filters_list @', JSON.stringify( $scope.filters_list ) );
			}
			if ( data.type == "product_list" )
			{

				$scope.current_page = data.current_page;
				var list = data.list;
				if ( ( $scope.current_page == 0 ) || $scope.current_page == undefined )
				{

					$scope.products_list = list;
          $localStorage.products_list = list;

				}
				else
				{
					//console.log('list has >',list);
					$scope.products_list = $scope.products_list.concat( list );
					//  console.log('product_list has >',$scope.products_list);
					//  console.log('in else of push',$scope.products_list.length);
				}

				if ( $scope.current_page == undefined )
				{
					$scope.textTag = 1;
				}
				else
					$scope.textTag = 0;

				$scope.total_items = data.total_length;
				if ( $scope.total_items == undefined )
				{
					$scope.total_items = $scope.products_list.length;
				}
				$scope.remining = Math.abs( ( ( $scope.total_items ) - ( $scope.products_list.length ) ) );

				console.log( 'reming = ' + $scope.remining + 'total>' + $scope.total_items + '- products_length>' + $scope.products_list.length );
			}
			if ( data.show_message != false )
			{
				var user = {};
				user.username = 'Selekt';
				user.message = data.message.message;
				user.date = new Date().getTime();
				user.image = 'http://dummyimage.com/250x250/000/fff&text=' + user.username.charAt( 0 ).toUpperCase();
				$scope.users.push( user );
			}

			$timeout( function()
			{
				$location.hash( 'bottom' );
				$anchorScroll();
				$location.hash( '' );
				$location.replace();
			} )
		} );
		$scope.createRoom = function( data )
		{
			$scope.currentUser = data.username;
			socket.emit( 'createroom', data );
		}

		$scope.joinRoom = function( data ) {

		}

		$scope.hideWave = function()
		{

			console.log( "wave hided" );
		}
		$scope.postDropdowns = function( element )
		{
			$scope.showload = 1;
			console.log( 'in posting dropdowns ', element );
			data = '{"session_id": "' + $scope.session_id + '","device_id"  :  "msdnlkafdnoacsndoahesh","user_name"  :"' + $scope.currentUser + '", "type" : "answer" ,"keys" :"' + element + '"}';

			var user = {};
			user.username = $scope.currentUser;
			var message = "";
			for ( k in $scope.inspiration_tiles )
			{
				console.log( 'key ##', JSON.stringify( $scope.inspiration_tiles[ k ].key ) );
				if ( $scope.inspiration_tiles[ k ].key == element )
					message = $scope.inspiration_tiles[ k ].value;

			}
			user.message = message;
			user.date = new Date().getTime();
			user.image = 'http://dummyimage.com/250x250/000/fff&text=' + user.username.charAt( 0 ).toUpperCase();
			$scope.users.push( user );


			socket.emit( 'user answers', data );
			$scope.inspiration_selected = undefined;
			$scope.results = [];
			$scope.inspiration_tiles = [];
		}


		$scope.pushToArray = function( value )
		{
			$scope.results[ 0 ] = value;
			console.log( 'pushed>>', $scope.results );
		}
		$scope.showNext = function( value )
		{
			switch ( value )
			{
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
		}

		// console.log('Url>',$location.path());
		// $scope.getChatProducts = function(){
		// $scope.reason = "with a western traditional touch"
		// var url = "http://52.74.62.47/rules_test/products/women_dresses?f=productLine:women_dresses ::neck:round neck,key hole neckline,spaghetti neck,other,sweetheart neck,one shoulder,strapless or tube,off-shoulder,halter neck,boat neck,keyhole neck,v-neck,square neck ::pattern:solid,lace,self design,jacquard ::fabric_type:other,cotton,georgette ::dress_shape:empire-line,other,Lace,Jacqaurd,Net,fit and flare,Crepe,A-Line,Maxi,wrap,Chiffon,blouson,bodycon,sheath,skater ::hemline:flounce,flared,straight,tulip,high-low,asymmetric or handkerchief ::pattern_type:solid,ethnic,floral ::&page=1";
		//       console.log('url :'+ url);
		//       $http.get(url).then(function (response) {
		//          // console.log('total data ::'+ response['data']['result']);
		//           $scope.products_list= response['data']['result'];
		//       })
		//   };
		// $scope.getChatProducts();

		// $scope.getBenefitRules = function(){

		// var url = "http://52.74.62.47/rules_test/getBenefitRules?benefit=elegant_look";
		//       console.log('url :'+ url);
		//       $http.get(url).then(function (response) {
		//         console.log('res>',response);
		//          $scope.displayText = response['data']['attribute_dependencies'];
		//          $scope.values1 = $scope.displayText[0].attribute_value.slice(0,4).toString().replace(/,/g ,', ');
		//          $scope.values2 = $scope.displayText[1].attribute_value.slice(0,4).toString().replace(/,/g ,', ');
		//         $scope.values3 = $scope.displayText[2].attribute_value.slice(0,4).toString().replace(/,/g ,', ');

		//       })
		// //   };
		//    $scope.getBenefitRules();
		$scope.postMesg = function( message )
		{
      

			$scope.showload = 1;
			data = '{"session_id" : "' + $scope.session_id + '","device_id"  :  "msdnlkafdnoacsndoahesh","user_name"  : "' + $scope.currentUser + ' ","type" : "message" ,"message" :"' + message + '" }';
			var user = {};
			user.username = $scope.currentUser;
			user.message = message;
			user.date = new Date().getTime();
			user.image = 'http://dummyimage.com/250x250/000/fff&text=' + user.username.charAt( 0 ).toUpperCase();
			$scope.users.push( user );
			socket.emit( 'user message', data );
			// $scope.inspiration_selected="false;"
			$scope.message = "";

			$scope.inspiration_tiles = undefined
		}

		$scope._show_more = 0;
		$scope.show_more_less = "Show More +";
		$scope.showMore = function()
		{
			if ( $scope.show_more_less == 'Show More +' )
			{
				$scope.show_more_less = "Show Less -";
				$scope._show_more = 1;
			}
			else
			{
				$scope.show_more_less = "Show More +";
				$scope._show_more = 0;

			}
		}

		$scope.setProductPage = function( x )
		{
			$rootScope.product_page = x;
			$rootScope.product_page[ 'image' ] = x.style_image.search.imageURL;
		}

		$rootScope.changeImage = function( image )
		{
			$rootScope.product_page[ 'image' ] = image;
		}

		$scope.colourIncludes = [];
		$scope.brandIncludes = [];
		$scope.priceIncludes = [];
		$scope.discount_percentIncludes = [];
		$scope.all_sizeIncludes = [];

		$scope.includeFilter = function( value, type, tag )
		{
			console.log( 'in includeFilter with tag>' + tag + '>' );
			var a = 0,
				b = 0;
			switch ( tag )
			{
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
			console.log( 'in adding', name );
			if ( a )
			{
				console.log( 'adding>' );
				var i = $.inArray( value, eval( name ) );
				if ( i > -1 )
				{
					eval( name ).splice( i, 1 );
				}
				else
				{
					eval( name ).push( value );
				}


			}

			if ( b )
			{
				console.log( 'sending.' );
				for ( index in $scope.filters_list )
				{
					if ( $scope.filters_list[ index ].key === type )
					{
						$scope.filters_list[ index ][ 'values' ] = eval( name );
					}

				}

				var temp_filter_list = $scope.filters_list;
				var final_filters = [];
				for ( i in temp_filter_list )
				{
					if ( temp_filter_list[ i ].values.length != 0 )
					{
						var json = {};
						json[ 'key' ] = temp_filter_list[ i ].key;
						json[ 'values' ] = temp_filter_list[ i ].values;
						final_filters.push( json );
					}
				}
				console.log( 'after sent filters>', JSON.stringify( final_filters ) );
				data = '{ "session_id" :"' + $scope.session_id + '","device_id"  :  "msdnlkafdnoacsndoahesh","user_name"  :"' + $scope.currentUser + '", "type": "filters", "filter_list" :' + JSON.stringify( final_filters ) + ' }';
				socket.emit( 'user answers', data );

			}

		}
		$scope.filter_expand = [ 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ];

		$scope.filterExpand = function( index )
		{
			$scope.filter_expand[ index ] = !$scope.filter_expand[ index ];


		}

		$scope.popUp = function( mesg )
		{
			$scope.show_filter = !$scope.show_filter;
			//$scope.show_more_popup = $scope.filters[0];
		}

		$scope.showing_more_filters = 0;

		$scope.popUpShowMore = function( more_filters, type, display_name )
		{

		 $scope.show_more_search = '';
            $scope.more_filters = more_filters;
            var tempArray = [];
            var chunk_size = 10;
            var temp = [];
            $scope.filter_letters = [];
            for (index = 0; index < more_filters.length; index++) {
                if (temp.indexOf(more_filters[index].charAt(0)) == -1) {
                    if (more_filters[index].charAt(0).charCodeAt(0) > 64 || more_filters[index].charAt(0).charCodeAt(0) < 32) {
                        temp.push(more_filters[index].charAt(0));
                        $scope.filter_letters.push(more_filters[index].charAt(0));
                    }
                    if (temp.indexOf('@') < 0 && more_filters[index].charAt(0).charCodeAt(0) < 65){
                        temp.push('@');
                        $scope.filter_letters.push('@');
                    }
                }
                temp.push(more_filters[index]);
            }
            $scope.chunk_type_name = type;
            $scope.search_display_name = display_name;
            $scope.chunk_filters = temp;
            console.log('new filters>', $scope.chunk_filters);
            $scope.showing_more_filters = 1;
            console.log('set showing more filters>' + $scope.showing_more_filters + 'side bar' + type.display_name);
        
		}

		$scope.getMe = function( value, type )
		{
			//console.log('type>'+type+'value>'+value);
			var name = '$scope.' + type + 'Includes';

			if ( eval( name ).includes( value ) )
				return 1
			else
				return 0
		}

		$scope.resetChat = function( clear )
		{
			var data = '{"session_id" :"' + $scope.session_id + '","device_id"  :  "msdnlkafdnoacsndoahesh","user_name"  : "User ","type" : "message" ,"message" :"clear" }';
			socket.emit( 'user message', data );
			$scope.users = [];
			$localStorage.users = [];
			$scope.inspiration_tiles = [];
		}


		$scope.show_all_filters = 0;
		$scope.v = 0;
		$scope.setV = function( index )
		{
			$scope.v = index;
		}

		$scope.closeSMF = function()
		{


			$scope.showing_more_filters = 0;
			$scope.show_more_search = ''
			console.log( 'pop up closed>', $scope.showing_more_filters );
		}
		$scope.filter_values_len = 10;
		$scope.clearAll = function( type )
		{
			var name = '$scope.' + type + 'Includes = []';
			eval( name );
			$scope.includeFilter( 'asd', type, 1 );
		}

		$scope.updateFiltersLen = function()
		{
        var arr = $filter('filter')($scope.filters[$scope.v].values, $scope.show_more_search);
            $scope.no_of_columns = Math.ceil(arr.length / 10);
      };

        $scope.gotoAnchor = function(x) {
            $anchorScroll.yOffset = 500;
            $anchorScroll("scrollTo_"+x);
            $location.hash('');
            $location.replace();
		        }
} ] );


/* Services */
app.factory( 'socket', function( $rootScope )
{
	var url = "https://www.selekt.in";
	console.log( 'in factory' );
	var socket = io.connect( url,
	{
		"path": "/selekt_website"
	} );
	return {
		on: function( eventName, callback )
		{
			socket.on( eventName, function()
			{
				var args = arguments;
				$rootScope.$apply( function()
				{
					callback.apply( socket, args );
				} );
			} );
		},
		emit: function( eventName, data, callback )
		{
			console.log( 'data >>', data );
			socket.emit( eventName, data, function()
			{
				var args = arguments;
				$rootScope.$apply( function()
				{
					if ( callback )
					{
						callback.apply( socket, args );
					}
				} );
			} )
		}
	};
} );

app.directive( "chatFilter2", function()
{
	return {
		restrict: 'EA',
		templateUrl: 'template/chat_filter.html'
	};
} );
app.directive( "chatBot2", function()
{
	return {
		restrict: 'EA',
		templateUrl: 'template/chat_bot.html'
	};
} );
app.directive( "productList", function()
{
	return {
		restrict: 'EA',
		templateUrl: 'template/product_list.html'
	};
} );

app.directive('autoScroll', function ($document, $timeout, $location) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.okSaveScroll = true;

            scope.scrollPos = {};

            $document.bind('scroll', function () {
                if (scope.okSaveScroll) {
                    scope.scrollPos[$location.path()] = $(window).scrollTop();
                }
            });

            scope.scrollClear = function (path) {
                scope.scrollPos[path] = 0;
            };

            scope.$on('$locationChangeSuccess', function (route) {
                $timeout(function () {
                    $(window).scrollTop(scope.scrollPos[$location.path()] ? scope.scrollPos[$location.path()] : 0);
                    scope.okSaveScroll = true;
                }, 0);
            });

            scope.$on('$locationChangeStart', function (event) {
                scope.okSaveScroll = false;
            });
        }
    };
})