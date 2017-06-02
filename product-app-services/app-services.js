/**
 * Created by admin on 05-Dec-16.
 */

var app = angular.module("appServices",["ngRoute"]);


app.factory("appService",function($http,$rootScope){
    console.log('root in servie',$rootScope.port);

    var oappService = {};
    oappService.getFields = function(productLine,cb){
        console.log('pdl>',productLine)
        var jsonURL = $rootScope.url +"/fields/"+productLine;
        console.log('root in servie',$rootScope.port);
        $http.get(jsonURL).then(function(response){
            cb && cb(response);
        });
    };

    oappService.getOldFields = function(cb){
        var jsonURL = $rootScope.url +"/fieldsOld/";
        $http.get(jsonURL).then(function(response){
            cb && cb(response);
        });
    };

    oappService.getProductLines = function (cb) {
         var jsonURL = $rootScope.url +"/getAllProductlines/";
        $http.get(jsonURL).then(function(response){
            cb && cb(response);
        });
    };

    oappService.getProductLineAttributes = function(productLine,cb){
        var json_url =    $rootScope.url +"/productLineAttributes/"+ productLine;

        $http.get(json_url).then(function (response) {
            cb && cb(response);
        })
    };

     oappService.getProductLineBenefits = function(productLine,cb){
         console.log('before',productLine);
         productLine = productLine.replace(/ /g,"%20");
         console.log('now',productLine);
        var json_url =    $rootScope.url +"/productLineBenefits/"+ productLine;
        console.log(json_url);
        $http.get(json_url).then(function (response) {
            cb && cb(response);
        })
    };

    oappService.getProductLineAttributeValues = function(productLine,productLineAttribute,cb){
        var url = $rootScope.url +"/productLineAttributeValues/"+productLine+"/"+productLineAttribute;
        console.log(url);
        $http.get(url).then(function(response){
            cb && cb(response);
        })
    };
 oappService.getProductLineBenefitValues = function(productLine,productLineAttribute,cb){
        var url = $rootScope.url +"/productLineBenefitValues/"+productLine+"/"+productLineAttribute.replace(/ /g,"%20");
        console.log(url);
        $http.get(url).then(function(response){
            cb && cb(response);
        })
    };

    oappService.getProductLineOccasions = function(productLine,cb){
        var url = $rootScope.url +"/occasionList/"+productLine;
        $http.get(url).
            then(function(response){
                console.log("response",response);
                cb && cb(response);
            },
            function(err){
                console.log(err);
            })

    };

    oappService.getStyleRulesCount = function(cb){
        var url = $rootScope.url +"/styleRulesCount";
        $http.get(url).then(
            function(resp){
                cb && cb(resp);
            },function(err){
                console.log(err);
            }
        )

    };

    return oappService;
});