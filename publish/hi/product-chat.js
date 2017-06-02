/**
 * Created by admin on 14-Dec-16.
 */

var app = angular.module("Search",[]);

app.controller("Search",["$http","$rootScope",'$scope','appService','$window','socket',"$location", "$anchorScroll","$timeout", '$routeParams',
    function($http,$rootScope,$scope,appService,$window,socket, $location, $anchorScroll,$timeout,$routeParams){
       $rootScope.search = $routeParams.search;
       $rootScope.search = $rootScope.search.replace(/ /g,"-");
       console.log('search>>>',$rootScope.search);
      $scope.getCnf;
      $scope.showName = 1;
      $scope.showColor =0;
      $scope.showHeight =0;
      $scope.chat =1;
      $scope.displayText={};
    $scope.users = [];
    $scope.products_list=[];
    $scope.inspiration_selected;
    $scope.results = [""];
    var session=Date.now();
    session=session.toString();
    $scope.session_id=session;
     $scope.inspiration_tiles=[];
  $scope.currentUser = 'User';
  $scope.chatImage = 'pics/chat_background.png';

   data='{"body_shape":"apple","skin_color" :"fair","age":"27-04-1995","height":"5-8", "session_id" :"'+$scope.session_id+'","device_id"  :  "msdnlkafdnoacsndoahesh","user_name"  :"'+$scope.currentUser+'"}';
   socket.emit('add user', data);
   pre_chat = '{"session_id" :"'+$scope.session_id+'","message" :"'+$rootScope.search+'"}';
   socket.emit('web', pre_chat);
  socket.on('connect', function () { });

  socket.on('updatechat', function (username, data) {
    var user = {};
    user.username = 'user';
    user.message = data;
    user.date = new Date().getTime();
    user.image = 'http://dummyimage.com/250x250/000/fff&text=' + username.charAt(0).toUpperCase();
    $scope.users.push(user);
  });
    data='{"body_shape":"apple","skin_color" :"fair","age":"27-04-1995","height":"5-8","session_id" : "'+$scope.session_id+'","device_id"  :  "msdnlkafdnoacsndoahesh","user_name"  : "user"}';
   
  socket.on('bot login', function (data) {
    $scope.getCnf=1;
   //  $scope.session_id= data.sessionId;
  //console.log("Bot login >> ",data)

  });
  socket.on('chat', function (data)
  {
       // console.log("Chat >> ",JSON.stringify(data));
        if(data.type=="text")
        {
            var user = {};
            user.username = 'Selekt';
            user.message = data.message;
            user.date = new Date().getTime();
            user.image = 'http://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
            $scope.users.push(user);
        }
        else if(data.type=="nested_select")
        {
            var title = data.title;
            var options = data.options;
           // console.log(options);
        }
        else if(data.type=="single_select")
        {
          
            var user = {};
            user.username = 'Selekt';
            user.message = data.text;
            user.date = new Date().getTime();
            user.image = 'http://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
            $scope.users.push(user);
            var title = data.title;
            $scope.inspiration_tiles = data.options;
            var options = data.options;
           // console.log(options);
            $timeout(function() {
                $location.hash('bottom');
                $anchorScroll();
                $location.hash('');
                $location.replace();
              })
        }
            $timeout(function() {
                $location.hash('bottom');
                $anchorScroll();
                $location.hash('');
                $location.replace();
              })
  });
  socket.on('browse', function (data) {
    console.log("Browse : ",JSON.stringify(data));
    if(data.type == "product_list")
    {
        var list = data.list;
        $scope.products_list=list;
       // console.log(list);
    }
  
        {
            var user = {};
            user.username = 'Selekt';
            user.message = data.message.message;
            user.date = new Date().getTime();
            user.image = 'http://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
            $scope.users.push(user);
        }
         $timeout(function() {
                $location.hash('bottom');
                $anchorScroll();
                $location.hash('');
                $location.replace();
              })
  });
  $scope.createRoom = function (data) {
    $scope.currentUser = data.username;
    socket.emit('createroom', data);
  }

  $scope.joinRoom = function (data) {
  
  }

  $scope.hideWave = function(){

    console.log("wave hided");
  }
   $scope.postDropdowns = function (element) {
  console.log('in posting dropdowns ',element);
   data='{"body_shape":"apple","skin_color" :"fair","age":"27-04-1995","height":"5-8","session_id": "'+$scope.session_id+'","device_id"  :  "msdnlkafdnoacsndoahesh","user_name"  :"'+$scope.currentUser+'", "type" : "answer" ,"keys" :"'+element+'"}';
    
      var user = {};
            user.username = $scope.currentUser;
            var message="";
            for(k in $scope.inspiration_tiles)
            {
              console.log('key ##',JSON.stringify($scope.inspiration_tiles[k].key));
              if($scope.inspiration_tiles[k].key==element)
              message=$scope.inspiration_tiles[k].value;

            }
            user.message = message;
            user.date = new Date().getTime();
            user.image = 'http://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
            $scope.users.push(user);
            
              
      socket.emit('user answers', data);
       $scope.inspiration_selected = undefined;
       $scope.results=[];
     $scope.inspiration_tiles=[];
  }
  
  
   $scope.pushToArray = function (value) {
   $scope.results[0]= value;
   console.log('pushed>>', $scope.results);
  }
 $scope.showNext = function (value) {
  switch(value)
  {
    case 'name': {
                    $scope.showName=1;
                    $scope.showHeight=0;
                    $scope.showColor=0;
                    break;
                  }
     case 'color' : {
                    $scope.showName=0;
                    $scope.showHeight=0;
                    $scope.showColor=1;
                    break;
                  
                      }
     case 'height' : {
                    $scope.showName=0;
                    $scope.showHeight=1;
                    $scope.showColor=0;
                    break;
                  
                      }               
      default: $scope.chat =1;                           
  }
  }
  console.log('Url>',$location.path());
  $scope.getChatProducts = function(){
	$scope.headings = $rootScope.search;
	$scope.reason = "with a western traditional touch"
  var url = "http://52.74.62.47/rules_test/products/women_dresses?f=productLine:women_dresses ::neck:round neck,key hole neckline,spaghetti neck,other,sweetheart neck,one shoulder,strapless or tube,off-shoulder,halter neck,boat neck,keyhole neck,v-neck,square neck ::pattern:solid,lace,self design,jacquard ::fabric_type:other,cotton,georgette ::dress_shape:empire-line,other,Lace,Jacqaurd,Net,fit and flare,Crepe,A-Line,Maxi,wrap,Chiffon,blouson,bodycon,sheath,skater ::hemline:flounce,flared,straight,tulip,high-low,asymmetric or handkerchief ::pattern_type:solid,ethnic,floral ::&page=1";
        console.log('url :'+ url);
        $http.get(url).then(function (response) {
           // console.log('total data ::'+ response['data']['result']);
            $scope.products_list= response['data']['result'];
        })
    };
$scope.getChatProducts();

  $scope.getBenefitRules = function(){

  var url = "http://52.74.62.47/rules_test/getBenefitRules?benefit=elegant_look";
        console.log('url :'+ url);
        $http.get(url).then(function (response) {
          console.log('res>',response);
           $scope.displayText = response['data']['attribute_dependencies'];
           $scope.values1 = $scope.displayText[0].attribute_value.slice(0,4).toString().replace(/,/g ,', ');
           $scope.values2 = $scope.displayText[1].attribute_value.slice(0,4).toString().replace(/,/g ,', ');
          $scope.values3 = $scope.displayText[2].attribute_value.slice(0,4).toString().replace(/,/g ,', ');
          console.log('str>',mah);
        })
    };
     $scope.getBenefitRules();
  $scope.postMesg = function (message) {
   data='{"body_shape":"apple","skin_color" :"fair","age":"27-04-1995","height":"5-8","session_id" : "'+$scope.session_id+'","device_id"  :  "msdnlkafdnoacsndoahesh","user_name"  : "' + $scope.currentUser+ ' ","type" : "message" ,"message" :"'+message+'" }';
            var user = {};
            user.username = $scope.currentUser;
            user.message = message;
            user.date = new Date().getTime();
            user.image = 'http://dummyimage.com/250x250/000/fff&text=' + user.username.charAt(0).toUpperCase();
            $scope.users.push(user);
    socket.emit('user message', data);
    // $scope.inspiration_selected="false;"
    $scope.message="";
  }
}]);


/* Services */
app.factory('socket', function ($rootScope) {
var url = "http://52.74.62.47";
console.log('in factory');
  var socket = io.connect(url,{"path" : "/test_fashion"});
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
    console.log('data >>',data);
      socket.emit(eventName,data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
