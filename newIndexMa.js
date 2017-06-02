var express = require('express');
var app = express();
var productTensorList = [];
function getType(productLine){
			var Keys = require('./newKeys.js');
			var type = {};
			type["keys"]= Object.keys(Keys[productLine]);
			type["list"] = Keys[productLine];
			type["collection"] = productLine;
			 return type;

};

function createTensorList(){
	productSimilarity.productSimilarity(1000,function(result){
		var data = result.hits.hits;
		console.log(data.length);
		for(var i=0;i<data.length;i++){
			var obj = {};
			obj["id"] = data[i]["_id"];
			obj["imageUrl"] = data[i]["_source"]["pdpData"]["styleImages"]["search"]["path"];
			obj["tensor"] = data[i]["_source"]["tensor"];
			obj["similarity"] = 0;
			productTensorList.push(obj);
		}
	});
}
var sort_by = function (field, reverse, primer) {

	var key = primer ? function (x) {
		return primer(x[field]);
	} : function (x) {
		return x[field];
	};

	reverse = !reverse ? 1 : -1;

	return function (a, b) {
		return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	};
};
	app.listen(9900);
	console.log("Listening on port 9900");
	console.log("creating tensor list ..");
	// createTensorList();
	

app.use('/', express.static(__dirname + 'index.html'));
app.use('/rules', express.static(__dirname + '/public/ProductSite/app/'));

app.get("/rules_test/products/:type", function(req, res) {
	var query = {};
	var result = [];
	var jsonResult = {};
	var rangefrom=0;
	var rangeto=50;

	var type = getType(req.params.type);
	jsonResult["category"] = [];
	jsonResult["count"] = 0;
	var product_line=req.params.type.toLowerCase();
	//console.log('type >>',getType[product_line]);
	console.log('type is ',product_line);
	var k=0;
	var send=0;
	if(!req.param('f'))
	{
		for(k in type["keys"])
		{
			var path = type["list"][type["keys"][k]];
			var key =  type["keys"][k];
			console.log(key ,' : ');
			var query = {
					index: 'styling_rules',
					type: 'unique_product_attribute',
					body: {
							"query": {"bool": {"must": [
										{
										"match": {"product_line_attribute_db_path":path}
										},
										{
										"match": {"product_line_name": product_line}
										}
														]
											}
									}
							}
				};
				function getValues(query,num,keyname){
	// 					
						elasticSearch.runQuery(query, function (results) {
							send++;
							if(results[0] != undefined)
							{//console.log('resilt>>',JSON.stringify(results));
							key = keyname; 
							data=results[0]["_source"]["product_line_attribute_value_list"];
							//console.log('resilt>>',JSON.stringify(data),':>',key);
							jsonResult["category"].push({"type":key,"values":data});
							}
		console.log('num in IN',num,'and send',send,'with key',key,'with length',type["keys"].length);
							if((send) == type["keys"].length){
								//console.log("send value at last");
								res.send(jsonResult);
								}	
								
							});
				}
				//console.log('num in out',k);
				getValues(query,k,key);
			}
	}
 
 if(req.param('f'))
		{
			var abc = {"bool":{"must":[]}};
			var query = {
				
					index: 'products_data2',
					type: product_line,
					body: 
					{
						"size": 200,
						"query":abc
						
					}
				};
			
			var params = req.param('f');
			params = params.replace(/%20/g, " ");
			var swdc = params.split(" ::");
			for(var i=0;i<swdc.length;i++)
			{
				var swc = swdc[i].split(':');
				for(var j=0;j<swc.length;j++)
				{
					var abc = swc[j].split(',');
					swc[j] = abc;
				}
				swdc[i] = swc;
			}
			console.log('===split==='+swdc);
			for(var i=0;i<swdc.length;i++)
			{
				var obj1 = swdc[i][0][0];
				var obj2 = swdc[i][1];

				
				console.log('obj1 is >',obj1,'type list >',JSON.stringify(type["list"]));
				if(Keys.getKey(type["list"],obj1)!=undefined && obj2[0]!=undefined)
				{
					
					var json = {};
					console.log('====obj2====',obj2.toString());
					if(obj2.toString() != '')
					{
						json[Keys.getKey(type["list"],obj1)] = obj2;
					query["body"]["query"]["bool"]["must"].push ({"terms":json});
					 console.log('=======json pushed==========',json);
					}
				}
			}
			console.log('============query for products=============',JSON.stringify(query));
			
			elasticSearch.runQuery(query, function (results) {
				
			var result1=[];
			for(var i=0;i<results.length ;i++)
				{
					var message = {};
					var link=results[i]._source.pdpData.landingPageUrl;
					 
					 if(link.includes("jabong")){
							var landingPageUrl = link;
							var styleImages = results[i]._source.pdpData.styleImages.default.path+"-pdp_slider_l.webp";
						}
					else {
						var landingPageUrl = link;
						var styleImages = results[i]._source.pdpData.styleImages.default.path;
						}
								message["landingPageUrl"] = landingPageUrl;
								message["styleImage"] = styleImages;
								message['brand'] = results[i]._source.product_filter.brand;
								message['website'] = results[i]._source.product_filter.website;
								message['price'] = results[i]._source.product_filter.price;
								message['discount_percent'] = results[i]._source.product_filter.discount_percent; 
								message['discount_price'] = results[i]._source.product_filter.discount_price;
								result1.push(message);
							
				}
						
						jsonResult["result"]=result1;
						res.send(jsonResult);
							
							});
			
		} 
		
// console.log('resilt JSOn>>',JSON.stringify(jsonResult));
// console.log('send is >',send);

});
app.get("/rules_test/productLineBenefits/:productLine",function(req,res){

console.log('in benefits ');
	var jsonResult = {};
	var product_line_attribute_list = [];
	var type = getType(req.params.productLine);
	for(var k in type["keys"])
		{
			var key =  type["keys"][k];
			product_line_attribute_list.push(key);
		}
		
		jsonResult["product_line_attribute_list"] = product_line_attribute_list;
		res.send(jsonResult);
});
app.get("/rules_test/getBenefitName/:productLine/:key",function(req,res){

	var productLine = req.params.productLine;
		var key = req.params.key.toLowerCase();
	console.log('productline>'+productLine+' key>'+key);
	var benefitNames = require('../../selekt_tarak/code/functions.js');
	var benefit_name = benefitNames['benefit_name'][productLine][key];
	console.log('benefit_name>',benefit_name);
	res.send(benefit_name);
});

app.get("/rules_test/getAllProductlines",function(req,res){

console.log('on getting all productlines');
	var jsonResult = {};
var query = {
		index: 'styling_rules',
		type: 'productline_attributes',
		body: {
			"query": {
				"bool": {
					"must": [
								{ "match": {"type": "product_line"}},
							]
						}
					}
			}
		};

	var product_lines = [];
	elasticSearch.runQuery(query, function (results) {
				
				for(i=0;i<results.length;i++)
				{
					product_lines = product_lines.concat(results[i]['_source']['value']);
				}

				console.log('resutls >>',JSON.stringify(product_lines));
				res.send(product_lines);
				});
});
app.get("/rules_test/productLineAttributes/:productLine",function(req,res){

	var jsonResult = {};
	//var type = getType[req.params.productLine.toLowerCase()];
	//jsonResult["product_line_attribute_list"] = type["keys"];
	//res.send(jsonResult);
	var productLine = req.params.productLine;
	var query = {
		"bool": {
			"must": [
				{ "match": {"product_line_name": productLine}},
			]
		}
	};

	var product_line_attribute_list = [];
	productSimilarity.getProductLineAttributesByQuery(query,100,function(result){
		for(var i=0;i<result.length;i++){
			product_line_attribute_list.push(result[i]["_source"]["product_line_attribute_db_path"].split(".")[1]);
		}
		jsonResult["product_line_attribute_list"] = product_line_attribute_list;
		res.send(jsonResult);
	});

});
app.get("/rules_test/productLineBenefitValues/:productLine/:productLineAttribute",function(req,res){

	console.log("on product line benefits");
	var productLine = req.params.productLine;
	var productLineAttribute = req.params.productLineAttribute;
	//var type = getType[productLine.toLowerCase()];
	//var path = type["list"][productLineAttribute];
	var query = {
				"bool": {
					"must": [
						{ "match": {"product_line_name": productLine}},
						{ "match_phrase": {"product_line_attribute_db_path": "product_filter."+productLineAttribute}}
			]
		}
	};

	var jsonResult = {};

	productSimilarity.getProductLineBenefitsByQuery(query,10,function(result){
		jsonResult["values"] = result[0]["_source"]["product_line_attribute_value_list"];
		res.send(jsonResult);
	});

	//db.collection(type["collection"]).distinct(path,function(err,data) {
	//	jsonResult["values"] = data;
	//	res.send(jsonResult);
	//});

});
app.get("/rules_test/productLineAttributeValues/:productLine/:productLineAttribute",function(req,res){

	console.log("on product line attributes");
	var productLine = req.params.productLine;
	var productLineAttribute = req.params.productLineAttribute;
	//var type = getType[productLine.toLowerCase()];
	//var path = type["list"][productLineAttribute];
	var query = {
		"bool": {
			"must": [
				{ "match": {"product_line_name": productLine}},
				{ "match_phrase": {"product_line_attribute_db_path": "product_filter."+productLineAttribute}}
			]
		}
	};

	var jsonResult = {};

	productSimilarity.getProductLineAttributesByQuery(query,10,function(result){
		jsonResult["values"] = result[0]["_source"]["product_line_attribute_value_list"];
		res.send(jsonResult);
	});

	//db.collection(type["collection"]).distinct(path,function(err,data) {
	//	jsonResult["values"] = data;
	//	res.send(jsonResult);
	//});

});
app.get("/rules_test/getOccasionsList/:productLine",function(req,res){
	console.log("On getOccasionsList..");
	var productline =  req.params.productLine;
	var query = {
					index: 'styling_rules',
					type: 'productline_attributes',
					body: {
						"_source": ["type","value"],
						"query": {"bool": { "must": [ 
													{ "match": {"type": "occasionList" } },
           											 { "match": {  "gender_name": productline} }
         											]
												}
   					}}};
				elasticSearch.runQuery(query, function (results) {
					var temp=[];
				console.log('result>>',results);
				for(i=0;i<results.length;i++)
				{
					temp = temp.concat(results[i]['_source']["value"])
				}
						res.send(temp);
				});
		
});

app.get("/rules_test/fields/:productLine",function(req,res){
	console.log("On fields..");
	var productline =  req.params.productLine;
	var query = {
					index: 'styling_rules',
					type: 'productline_attributes',
					body: {
						"_source": ["type","value"],
						"query": {"bool": {"must": {"match": {"gender_name": productline}},
										"must_not": [
														{"match": {"type": "occasion"}},
														{"match": {"type": "product_line"}},
														{"match": {"type": "occasionList"}} 
													]
						 }}}};
				elasticSearch.runQuery(query, function (results) {
					var temp=[];
				console.log('result>>',results);
				for(i=0;i<results.length;i++)
				{
					temp.push(results[i]['_source'])
				}
						res.send(temp);
				});
		
});
app.get("/rules_test/fieldsOld",function(req,res){
	console.log("On fields old..");
	var fields_json_file = __dirname +"/fields_old.json";
	jsonfile.readFile(fields_json_file, function(err, obj) {
		res.send(obj);
	});
});
app.get("/rules_test/productSimilarity",function(req,res){

	productSimilarity.productSimilarity(100,function (response) {
		var result = [];
		var data = response.hits.hits;
		for(var i=0;i<data.length;i++){
			var obj = {};
			obj["id"] = data[i]["_id"];
			obj["imageUrl"] = data[i]["_source"]["pdpData"]["styleImages"]["search"]["path"];
			result.push(obj);
		}
		res.send(result)
	});

});
app.get("/rules_test/prosim/:id",function(req,res){

	var id = req.params.id;
	var resultList = [];
	productSimilarity.getProductById(""+id, function (response) {
		try{
			var sourceTensor = response["sourceProduct"]["_source"]["tensor"];
			var similarList = response["similarProduct"];
			console.log("Get Similar List with "+similarList.length+" length");
			for(var i=0;i<similarList.length;i++){
				var obj = {};
				try{
					obj["id"] = similarList[i]["id"];
					obj["imageUrl"] = similarList[i]["imageUrl"];
					obj["similarity"] = similarity(sourceTensor, similarList[i]["tensor"]);
					if(similarList[i]["tensor"]=="NA")
						obj["similarity"]=0;
					resultList.push(obj);
				}catch(e){}
			}
			resultList.sort(sort_by("similarity",true,null));
			res.send(resultList);
		}catch(e){res.send([]);}
	});
});
var occasion_id  = 0;
app.get("/rules_test/styleRulesCount",function(req,res){

	productSimilarity.getStyleRulesCount(function(count){
		console.log("count is ",count);
		var obj = {};
		obj["count"] = count;
		res.send(obj);
	});

});
app.get("/rules_test/styleRulesEdit",function(req,res){
	console.log("on styleRules ");
	var obj = req.query["obj"];
	console.log("before parsing..",typeof obj,obj);
	obj = (JSON).parse(obj);
	console.log(obj);
	var product_attribute = obj["product_attribute"];
	var type = getType(obj["product_line_name"].toLowerCase());
	product_attribute = type["list"][product_attribute];
	var profile_attribute_value = obj["profile_attribute_value"];
	var product_line_name = obj["product_line_name"];
	console.log(product_attribute);
	console.log(profile_attribute_value);
	console.log(product_line_name);

	var query = {
		"bool": {
			"must": [
				{"match": {"product_line_name": product_line_name}},
				{"match_phrase": {"product_attribute": product_attribute}}
			]
		}
	};

	var count = 0;
	productSimilarity.getStyleRulesByQuery(query,1000,function(result){
		for(var i=0;i<result.length;i++){
			var item = result[i];
			if(item["_source"]["product_line_name"].toLowerCase() == product_line_name.toLowerCase() &&
				item["_source"]["product_attribute"] ==  product_attribute &&
				(item["_source"]["profile_attribute_value"] == profile_attribute_value ||
				item["_source"]["occasion_value"] == profile_attribute_value) ){
				console.log(JSON.stringify(item["_source"]));
				obj["status"] = "old";
				obj["comments"]=item["_source"]["comments"];
				obj["doc_id"] = item["_id"];
				
				count++;
				obj["ranking"] = item["_source"]["ranking"];
			}
		}
		if(count > 0) {
			console.log("Total count ", count);
			res.send(obj);
		}
		else {
			console.log("forming new rule...");
			var query = {
				"bool": {
					"must": [
						{ "match": {"product_line_name": product_line_name}},
						{ "match_phrase": {"product_line_attribute_db_path": product_attribute}}
					]
				}
			};

			productSimilarity.getProductLineAttributesByQuery(query,10,function(result){
				if(result.length > 0) {
					var values = result[0]["_source"]["product_line_attribute_value_list"];
					obj["status"] = "new";
					obj["values"] = [];
					for (var i = 0; i < values.length; i++) {
						var obj2 = {};
						obj2["product_attribute_value"] = values[i];
						obj2["rank"] = "";
						obj["values"].push(obj2);
					}
				}else {obj["status"] = "error";}
				
				res.send(obj);

			});

			//db.collection(type["collection"]).distinct(product_attribute,function(err,data) {
			//	if(err){
			//		console.log(err);
			//		obj["status"] = "error";
			//	}
			//	else if(  data != undefined && data != null) {
			//		obj["status"] = "new";
			//		obj["values"] = [];
			//		for (var i = 0; i < data.length; i++) {
			//			var obj2 = {};
			//			obj2["product_attribute_value"] = data[i];
			//			obj2["rank"] = "";
			//			obj["values"].push(obj2);
			//		}
			//	}
			//	res.send(obj);
			//});
		}
	});
});
app.post("/rules_test/styleRules",function(req,res){

	console.log("on post srule");
	if (req.method == 'POST') {
		var jsonString = '';
		req.on('data', function (data) {
			jsonString += data;
		});
		req.on('end', function () {
			var data = JSON.parse(jsonString);
			var obj = data["obj"];
			var product_attribute = obj["product_attribute"];
			var type = getType(obj["product_line_name"].toLowerCase());
			obj["product_attribute"] = type["list"][product_attribute];
			var doc_id =  data["doc_id"]; // to edit a document
			var idList = [];
			productSimilarity.getAllStylingRules(function(result){

				var id;
				if(doc_id != undefined){ // edit a doc
					id = parseInt(doc_id);
				}
				else {
					if (result.length == 0) {
						id = 1;
					}
					else {
						for (var i = 0; i < result.length; i++) {
							idList.push(parseInt(result[i]["_id"]));
						}
						
						var maxId=-1;
						for(i=0;i<idList.length;i++)
						{
							if(idList[i]>maxId)
							maxId=idList[i];

						}
						id=maxId+1;

					}
				}
				if(id % 5 == 0){
					storeDb.storeStyleRules();
				}
				console.log("new rules id##",id);
				console.log("data >>",obj);
				productSimilarity.insertOneStyleRule(id,obj,function(response){
					res.send("one doc has been inserted on Id " + id);
				});
			})
		});
	}

});
app.post("/rules_test/occasion",function(req,res){

	console.log("on post occasion ");
	if (req.method == 'POST') {
		var jsonString = '';
		req.on('data', function (data) {
			jsonString += data;
		});
		req.on('end', function () {
			var data = JSON.parse(jsonString);
			var obj = data["obj"];
			var doc_id = data["doc_id"]; // to edit a document
			var idList = [];
			productSimilarity.getAllOccasions(function(result){
				var id;
				if(doc_id != undefined){  id = parseInt(doc_id); }
				else {
					if (result.length == 0) { id =1; } // first doc
					else {
						for (var i = 0; i < result.length; i++) {
							idList.push(parseInt(result[i]["_id"]));
						}
						id = Math.max.apply(null, idList) + 1;
					}
				}
				if(id % 5 == 0){ storeDb.storeOccasionRules(); }
				productSimilarity.insetOccasion(id,obj,function(resp){
					console.log("inserted..");
					res.send(resp);
				});
			});
		})
	}
});
app.get("/rules_test/occasionCount",function(req,res){
	productSimilarity.getOccasionCount(function(count){
		var obj = {};
		obj["count"] = count;
		res.send(obj);
	})
});
app.get("/rules_test/occasionList/",function(req,res){

	console.log("on occasion list");
	productSimilarity.getAllOccasions(function(response){
		res.send(response);
	});

});
app.get("/rules_test/occasionList/:productLine",function(req,res){

	console.log("on occasion list productline");
	var productLine = req.params.productLine;
	var occasionList = [];
	console.log(productLine);
	var query = {
			"bool": {
				"must": [
					{"match": {"product_line_name": productLine}}
				]
			}
	};

	productSimilarity.getOccasionsByQuery(query,300,function(response){
		for(var i=0;i<response.length;i++){
			occasionList.push(response[i]["_source"]["occasion_value"]);
		}
		console.log("occsionlist length",occasionList.length);
		res.send(occasionList);

	});

});
app.get("/rules_test/occasionList/:productLine/:occasionValue",function(req,res){

	var productLine = req.params.productLine;
	var occasionValue = req.params.occasionValue;
	var query = {
		"bool": {
			"must": [
				{"match": {"product_line_name": productLine}},
				{"match": {"occasion_value": occasionValue}}
			]
		}
	};
	productSimilarity.getOccasionsByQuery(query,1,function(response){
		var obj = {};
		console.log("found",response);
		obj["doc_id"] = response[0]["_id"];
		obj["occasion_value_list"] = response[0]["_source"]["occasion_value_list"];
		res.send(obj);

	});

});
function swap(json){
	var ret = {};
	for(var key in json){
		ret[json[key]] = key;
	}
	return ret;
}
function removeDuplicates(myArray) {
	var uniqueArray = myArray.filter(function (elem, pos) {
		return myArray.indexOf(elem) == pos;
	});

	return uniqueArray;
}
app.get("/rules_test/priority/:productLine",function(req,res){

	console.log("on priority");
	 var productLine = req.params.productLine;
	 var productAttObj = swap(getType(productLine.toLowerCase())["list"]);
	 var obj = {};
	 var responseList = [];

	var query = {
		"bool": {
			"must": [
				{"match": {"product_line_name": productLine}}
			]
		}
	};
	productSimilarity.getStyleRulesByQuery(query,700,function(response){
		for(var i=0;i<response.length;i++){
			var productAttribute = response[i]["_source"]["product_attribute"];
			responseList.push(productAttObj[productAttribute]);
		}
		obj["values"] = removeDuplicates(responseList);
		res.send(obj);
	});

});
app.get("/rules_test/priority/:productLine/:productLineAttribute",function(req,res){

	console.log("on priority product line attribute");
	var productLine = req.params.productLine;
	var productLineAttribute = req.params.productLineAttribute;

	var type = getType(productLine.toLowerCase());
	productLineAttribute = type["list"][productLineAttribute];
	var responseList = [];
	var respObj = {};

	var query = {
		"bool": {
			"must": [
				{"match": {"product_line_name": productLine}},
				{"match_phrase": {"product_attribute": productLineAttribute}}
			]
		}
	};
	console.log(productLine);
	console.log(productLineAttribute);
	productSimilarity.getStyleRulesByQuery(query,700,function(response){
		productSimilarity.getPriorityRulesByQuery(query,100,function(rules){
			console.log("rules : ",rules.length);
			 console.log(" style rules length",response.length);
			for(var i=0;i<response.length;i++){
				if(response[i]["_source"]["product_line_name"].toLowerCase() === productLine.toLowerCase() &&
					response[i]["_source"]["product_attribute"].toLowerCase() === productLineAttribute.toLowerCase()) {

					var occasion_value = response[i]["_source"]["occasion_value"];
					var profile_attribute_value = response[i]["_source"]["profile_attribute_value"];
					var obj = {};
					if (occasion_value != undefined) {
						obj["name"] = "occasion_value";
						obj["value"] = occasion_value;
						obj["rank"] = "";
					} else if (profile_attribute_value != undefined) {
						obj["name"] = "profile_attribute_value";
						obj["value"] = profile_attribute_value;
						obj["rank"] = ""
					}
					responseList.push(obj);
				}
			}
			console.log("one step ended response list size",responseList.length);

			var itemId = -1;
			if(rules.length > 0 && responseList.length > 0) {
				for (var z = 0; z < responseList.length; z++) {
					console.log("z *", responseList[z]["value"]);
					itemId = rules[0]["_id"];
					var rankingList = rules[0]["_source"]["ranking"];
					for (var k = 0; k < rankingList.length; k++) {
						if (rankingList[k]["attribute_value"] == responseList[z]["value"]) {
							responseList[z]["rank"] = rankingList[k]["rank"];
							break;
						}
					}
				}
			}
			respObj["doc_id"] = itemId;
			respObj["values"] = responseList;
			console.log("sending response..",responseList.length);
			res.send(respObj);
		});
	});

});
app.post("/rules_test/priority",function(req,res){

	console.log("on post priority");

	if (req.method == 'POST') {
		var jsonString = '';
		console.log("on");
		req.on('data', function (data) {
			jsonString += data;
		});
		req.on('end', function () {
			var data = JSON.parse(jsonString);
			var obj = data["obj"];
			var docId = data["doc_id"];
			var product_attribute = obj["product_attribute"];
			var type = getType(obj["product_line_name"].toLowerCase());
			obj["product_attribute"] = type["list"][product_attribute];

			var idList = [];
			productSimilarity.getAllPriorityRules(function(result){
				var id;
				if(docId != -1) { id = docId; }
				else {
					if (result.length == 0) { id = 1; }
					else {
							for (var i = 0; i < result.length; i++) {
								idList.push(parseInt(result[i]["_id"]));
							}
						id = Math.max.apply(null, idList) + 1;
					}
				}
				if(id % 5 == 0){ storeDb.storePriorityRules(); }
				productSimilarity.insertOnePriorityRule(id,obj,function(response){
					res.send(response);
				});
			})
		});
	}
});
app.get("/rules_test/priorityRulesCount",function(req,res){

	productSimilarity.getPriorityRulesCount(function(count){
		var obj = {};
		obj["count"] = count;
		res.send(obj);
	})
});
app.post("/rules_test/benefitNames",function(req,res){

	console.log(" on post adjective names");
	if (req.method == 'POST') {
		var jsonString = '';
		console.log("on");
		req.on('data', function (data) {
			jsonString += data;
		});
		req.on('end', function () {
			var data = JSON.parse(jsonString);
			var obj = data["obj"];
			var adjectiveName = obj["adjective_value"];
			var idList = [];
			var foundAdjective = null;
			productSimilarity.getAllBenefitNames(function (result) {
				var id;
				var max = 0;
				if (result.length == 0) {id = 1;}
				else {
					for (var i = 0; i < result.length; i++) {
						if(parseInt(result[i]["_id"]) > max ){
							max = parseInt(result[i]["_id"]);
						}
						
						idList.push(parseInt(result[i]["_id"]));
						if(result[i]["_source"]["adjective_value"] == adjectiveName &&
						result[i]["_source"]["product_line_name"].toLowerCase() == obj["product_line_name"].toLowerCase()) {

							foundAdjective = result[i];
							break;
						}
					}
					if(foundAdjective == null) {
						//id = Math.max.apply(null, idList) + 1;
						id =  max + 1;
					} else {
						id = foundAdjective["_id"];
						obj["adjective_value_list"] =
							obj["adjective_value_list"].concat(foundAdjective["_source"]["adjective_value_list"])
					}
				}
				if(id%5 == 0){
					storeDb.storeAdjNames();
				}

				productSimilarity.insetBenefitName(id, obj, function (response) {
					res.send(response);
				});
			})
		})
	}
});

app.post("/rules_test/adjectiveNames",function(req,res){

	console.log(" on post adjective names");
	if (req.method == 'POST') {
		var jsonString = '';
		console.log("on");
		req.on('data', function (data) {
			jsonString += data;
		});
		req.on('end', function () {
			var data = JSON.parse(jsonString);
			var obj = data["obj"];
			var adjectiveName = obj["adjective_value"];
			var idList = [];
			var foundAdjective = null;
			productSimilarity.getAllAdjectiveNames(function (result) {
				var id;
				var max = 0;
				if (result.length == 0) {id = 1;}
				else {
					for (var i = 0; i < result.length; i++) {
						if(parseInt(result[i]["_id"]) > max ){
							max = parseInt(result[i]["_id"]);
						}
						
						idList.push(parseInt(result[i]["_id"]));
						if(result[i]["_source"]["adjective_value"] == adjectiveName &&
						result[i]["_source"]["product_line_name"].toLowerCase() == obj["product_line_name"].toLowerCase()) {

							foundAdjective = result[i];
							break;
						}
					}
					if(foundAdjective == null) {
						//id = Math.max.apply(null, idList) + 1;
						id =  max + 1;
					} else {
						id = foundAdjective["_id"];
						obj["adjective_value_list"] =
							obj["adjective_value_list"].concat(foundAdjective["_source"]["adjective_value_list"])
					}
				}
				if(id%5 == 0){
					storeDb.storeAdjNames();
				}

				productSimilarity.insetAdjectiveName(id, obj, function (response) {
					res.send(response);
				});
			})
		})
	}
});
app.get("/rules_test/adjectiveNamesCount",function(req,res){
	console.log("on get adjective names count");
	productSimilarity.getAdjectivesNamesCount(function(count){
		var obj = {};
		obj["count"] = count;
		res.send(obj);
	})
});
app.get("/rules_test/benefitNamesCount",function(req,res){
	console.log("on get benefit names count");
	productSimilarity.getBenefitNamesCount(function(count){
		var obj = {};
		obj["count"] = count;
		res.send(obj);
	})
});
app.get("/rules_test/adjectiveNames/:productLine",function(req,res){

	console.log("on adjectivenames list productline");
	var productLine = req.params.productLine;
	var adjectiveNamesList = [];
	console.log(productLine);
	var query = {
		"bool": {
			"must": [
				{"match": {"product_line_name": productLine}}
			]
		}
	};

	productSimilarity.getAdjectiveNamesByQuery(query,300,function(response){
		for(var i=0;i<response.length;i++){
			adjectiveNamesList.push(response[i]["_source"]["adjective_value"]);
		}
		console.log("adjectiveNames length",adjectiveNamesList.length);
		res.send(adjectiveNamesList);

	});

});


app.get("/rules_test/benefitNames/:productLine",function(req,res){

	console.log("on benefitNames list productline");
	var productLine = req.params.productLine;
	var adjectiveNamesList = [];
	console.log(productLine);
	var query = {
		"bool": {
			"must": [
				{"match": {"product_line_name": productLine}}
			]
		}
	};

	productSimilarity.getBenefitNamesByQuery(query,300,function(response){
		for(var i=0;i<response.length;i++){
			adjectiveNamesList.push(response[i]["_source"]["adjective_value"]);
		}
		console.log("adjectiveNames length",adjectiveNamesList.length);
		res.send(adjectiveNamesList);

	});

});

//this is for getting previous checkboxes

app.get("/rules_test/loadPreviousCheckboxesOfBenefits/:similarRulesId",function(req,res){

	console.log("on getting similar rules id checkboxes");
	var similarRuleId = req.params.similarRulesId;
	var similarRule = [];
	console.log();
	var query =  {
        "bool" : {
            "must" : [ 
                { "match": {"_id": similarRuleId } }
                
            ]
         }
    
    };

	productSimilarity.getBenefitRulesByQuery(query,300,function(response){
		console.log(response.length);
		for(var i=0;i<response.length;i++){
			similarRule.push(response[i]["_source"]);
		}
		console.log("similarRule length",similarRule.length);
		res.send(similarRule);
		console.log(similarRule);
	});

}); 

app.get("/rules_test/loadPreviousCheckboxes/:similarRulesId",function(req,res){

	console.log("on getting similar rules id checkboxes");
	var similarRuleId = req.params.similarRulesId;
	var similarRule = [];
	console.log();
	var query =  {
        "bool" : {
            "must" : [ 
                { "match": {"_id": similarRuleId } }
                
            ]
         }
    
    };

	productSimilarity.getAdjectiveRulesByQuery(query,300,function(response){
		console.log(response.length);
		for(var i=0;i<response.length;i++){
			similarRule.push(response[i]["_source"]);
		}
		console.log("similarRule length",similarRule.length);
		res.send(similarRule);
		console.log(similarRule);
	});

}); 
app.get("/rules_test/getSimilarRulesOfBenefits/:productLineSelected/:adjectiveNameSelected/:adjectiveValueSelected",function(req,res){

	console.log("on getting similar rules id of productline");
	var productLine = req.params.productLineSelected;
	var adjectiveName = req.params.adjectiveNameSelected;
	var adjectiveValue = req.params.adjectiveValueSelected;
	var adjectiveNamesList = [];
	console.log(productLine,adjectiveName,adjectiveValue);
	var query =  {
          
        "bool" : {
            "must" : [ 
                { "match_phrase": {"adjective_value": adjectiveName } },
                { "match_phrase": {  "adjective_value": adjectiveValue}},
                 { "match_phrase": {"product_line_name": productLine } }
                
                
            ]
         }
    
    };

	productSimilarity.getBenefitRulesByQuery(query,300,function(response){
		console.log(response.length);
		for(var i=0;i<response.length;i++){
			adjectiveNamesList.push(response[i]["_id"]);
		}
		console.log("adjectiveNames length",adjectiveNamesList.length);
		res.send(adjectiveNamesList);
		
	});

}); 
app.get("/rules_test/getSimilarRules/:productLineSelected/:adjectiveNameSelected/:adjectiveValueSelected",function(req,res){

	console.log("on getting similar rules id of productline");
	var productLine = req.params.productLineSelected;
	var adjectiveName = req.params.adjectiveNameSelected;
	var adjectiveValue = req.params.adjectiveValueSelected;
	var adjectiveNamesList = [];
	console.log(productLine,adjectiveName,adjectiveValue);
	var query =  {
          
        "bool" : {
            "must" : [ 
                { "match_phrase": {"adjective_value": adjectiveName } },
                { "match_phrase": {  "adjective_value": adjectiveValue}},
                 { "match_phrase": {"product_line_name": productLine } }
                
                
            ]
         }
    
    };

	productSimilarity.getAdjectiveRulesByQuery(query,300,function(response){
		console.log(response.length);
		for(var i=0;i<response.length;i++){
			adjectiveNamesList.push(response[i]["_id"]);
		}
		console.log("adjectiveNames length",adjectiveNamesList.length);
		res.send(adjectiveNamesList);
		
	});

}); //this is newly added upper
app.get("/rules_test/benefitNames/:productLine/:adjName",function(req,res){

	console.log("on benefitNames list productline and benefit name");
	var productLine = req.params.productLine;
	var adjectiveName = req.params.adjName;
	var adjectiveNamesList = [];
	console.log(productLine);
	var query = {
		"bool": {
			"must": [
				{
					"match_phrase": {"product_line_name": productLine}
				},
				{
					"match_phrase": {"adjective_value": adjectiveName}
				}
			]
		}
	};

	productSimilarity.getBenefitNamesByQuery(query,300,function(response){
		res.send(response[0]["_source"]["adjective_value_list"]);

	});

});

app.get("/rules_test/adjectiveNames/:productLine/:adjName",function(req,res){

	console.log("on adjectivenames list productline and adjective name");
	var productLine = req.params.productLine;
	var adjectiveName = req.params.adjName;
	var adjectiveNamesList = [];
	console.log(productLine);
	var query = {
		"bool": {
			"must": [
				{
					"match_phrase": {"product_line_name": productLine}
				},
				{
					"match_phrase": {"adjective_value": adjectiveName}
				}
			]
		}
	};

	productSimilarity.getAdjectiveNamesByQuery(query,300,function(response){
		res.send(response[0]["_source"]["adjective_value_list"]);

	});

});

app.post("/rules_test/addBenefit",function(req,res){

	console.log(" on post add benefit .");

	if (req.method == 'POST') {
		var jsonString = '';
		console.log("on");
		req.on('data', function (data) {
			jsonString += data;
		});
		req.on('end', function () {
			var data = JSON.parse(jsonString);
			var obj = data["obj"];
			var id = parseInt(data["id"]);
			var idList = [];
			var max = -1;
			console.log("id is  : ",id , typeof id);
			productSimilarity.getAllBenefitRules(function (result) {
				if(id == -1) {
					if (result.length == 0) {id = 1;}
					else {
						console.log("else case here")
						for (var i = 0; i < result.length; i++) {
							console.log(parseInt(result[i]["_id"]));
							if(parseInt(result[i]["_id"]) > max)
								max = parseInt(result[i]["_id"]);
						//	idList.push(parseInt(result[i]["_id"]));
						}
						id = max + 1;
					//	id = Math.max.apply(null, idList) + 1;
					}
				}
				console.log("Max num: ",id);
				if(id % 5 == 0){
					storeDb.storeAdjectiveRules();
				}
				console.log("inserting at id ",id);
				if( id != undefined ) {
					productSimilarity.insetBenefit(id, obj, function (response) {
						
						var time_stamp = new Date();
						var data_update = '\r\nAt '+ time_stamp + ' with id ' + id;
						var hours = new Date().getHours();
						console.log('====== time_stamp =======',time_stamp);
						if((hours <=19 ) && (hours >7))
						{
							fs.appendFile('./New Folder/Benefits_update_8amTo8pm.txt', data_update , function (err) {
								if (err) return console.log(err);
								console.log('Appended to 8am to 8pm File!>',data_update);
								});
						}
						else
						{
							fs.appendFile('./New Folder/Benefits_update_8pmTo8am.txt', data_update , function (err) {
								if (err) return console.log(err);
								console.log('Appended to 8pm to 8am File!>',data_update);
								});
						}

						res.send(response);
					});
				}
			})

		});
	}
});

app.post("/rules_test/addAdjective",function(req,res){

	console.log(" on post add adjective .");

	if (req.method == 'POST') {
		var jsonString = '';
		console.log("on");
		req.on('data', function (data) {
			jsonString += data;
		});
		req.on('end', function () {
			var data = JSON.parse(jsonString);
			var obj = data["obj"];
			var id = parseInt(data["id"]);
			var idList = [];
			var max = -1;
			console.log("id is  : ",id , typeof id);
			productSimilarity.getAllAdjectiveRules(function (result) {
				if(id == -1) {
					if (result.length == 0) {id = 1;}
					else {
						console.log("else case here")
						for (var i = 0; i < result.length; i++) {
							console.log(parseInt(result[i]["_id"]));
							if(parseInt(result[i]["_id"]) > max)
								max = parseInt(result[i]["_id"]);
						//	idList.push(parseInt(result[i]["_id"]));
						}
						id = max + 1;
					//	id = Math.max.apply(null, idList) + 1;
					}
				}
				console.log("Max num: ",id);
				if(id % 5 == 0){
					storeDb.storeAdjectiveRules();
				}

				console.log("inserting at id ",id);
				if( id != undefined ) {
					productSimilarity.insetAdjective(id, obj, function (response) {
						res.send(response);
					});
				}
			})

		});
	}
});
var rules_file_path = __dirname+'/handbag_rule_book_json.json';
var priority_file_path =__dirname+'/handbag_priority_json.json';

function get_products(use_case,callback) {
	//console.log("in get products");
	var matched_rules = [];
	// This is temporary. Needs to be changed
	var client_data = [use_case.age,
				use_case.body_shape,
				use_case.height,
				use_case.occasion,
				use_case.skin_color];

	var elasticQuery = {
		index: 'styling_rules',
		type: 'style_rules',
		body: {
			"query": {
					"match_all" : {
					}
			}
		},
		size : 800
	};
	//elasticQuery.body.query.bool.must.match.product_line_name = use_case.product_line;
	console.log("before running style rules query");
	elasticSearch.runQuery(elasticQuery, function (result) { 
		console.log("result in ranking styling rules query from Db: ",result.length); 
		for(var i = 0; i < result.length; i++) {
			var json = result[i]["_source"];
			for(var j=0;j<client_data.length; j++) {
				var profile_attribute = client_data[j];

				if( json["product_line_name"].toLowerCase() == use_case.product_line.toLowerCase()
							&& json['profile_attribute_value'] == profile_attribute) {
					matched_rules.push(json);
				}
				if( json["product_line_name"].toLowerCase() == use_case.product_line.toLowerCase() &&
						json['occasion_value'] == profile_attribute) {

					matched_rules.push(json);
				}
			}
		}
		console.log("Matched rules Length: ",matched_rules.length);

		removeConflicts(matched_rules,use_case.product_line, function (result) {

			console.log(" after remove conflicts Rules length .. ",result.length);
			fs.writeFile("./db_data/rules.json", JSON.stringify(result), function (err) {
				if (err) {
					return console.log(err);
				}
				console.log("The file was saved!");
			});
			var obj = {};
			obj["applied_rules"] = result;
			fetchData(use_case,result,function(result_set){
				obj["product_list"] = result_set;
				obj["page_number"] = use_case.page_number;
				callback(obj);
				console.log("response here *** sending call back ***");
			})

		});
	});
}
function fetchData(use_case,result,cb){

	var elastic_query_based_for_rules = buildQueryFromRankingRules(use_case,result);
	fs.writeFile("./db_data/query.json", JSON.stringify(elastic_query_based_for_rules), function (err) {
		if (err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	});

	elasticSearch.runQuery(elastic_query_based_for_rules, function (result_set) {

		//cb(result_set);
		if(result_set.length > 0){
			cb(result_set);
		}else{
			use_case.page_number = use_case.page_number + 1;
			fetchData(use_case,result,cb);
		}

	});
}
function removeConflicts(rules,product_line,callback) {
	var elasticQuery = {
		index: 'styling_rules',
		type: 'priority_rules',
		body: {
			"query" :{
				"match" : {
					"product_line_name" : product_line
				}
			}
		},
		size: 300
	};
	//elasticQuery.body.query.bool.must.match.product_line_name = product_line;

	elasticSearch.runQuery(elasticQuery, function (results) {
		var conflict_removed_rules = [];
		for(var i=0;i<results.length;i++) { // priority rules
			var priority_object = results[i]["_source"];
			let rules_for_one_attribute = [];

			// Getting rules for one product_attribute
			for(var j in rules) {
				let rule = rules[j];
				if(rule['product_line_name'].toLowerCase() == priority_object['product_line_name'].toLowerCase() &&
					rule['product_attribute'] == priority_object['product_attribute']) {
					rules_for_one_attribute.push(rule);
				}
			}

			let rankings = priority_object['ranking'];
			rankings = rankings.sort(function(a, b){
				return a['rank'] - b['rank'];
			});

			for(let row in rankings) {
				let found_rule = false;
				if (rankings[row]["rank"] != undefined && rankings[row]["rank"] != null && rankings[row]["rank"] > 0) {
					for (let rule in rules_for_one_attribute) {
						if (rankings[row]['attribute_value'] == rules_for_one_attribute[rule][rankings[row]['attribute_type']]) {
							conflict_removed_rules.push(rules_for_one_attribute[rule]);
							found_rule = true;
							break;
						}
					}
					if (found_rule) break;
				}
			}
		}
		callback(conflict_removed_rules);
	});
}
function buildQueryFromRankingRules(use_case,rules){

	console.log("building query from rules");
	var applyingRule;
	//if(use_case.page_number == 0) {
	//	rulesComb = permutations.inputForComb(rules);
	//	applyingRule = rulesComb[0]["rankList"];
	//}else{
	//	applyingRule = rulesComb[use_case.page_number]["rankList"];
	//}

	var rulesComb = permutations.inputForComb(rules);
	applyingRule = rulesComb[use_case.page_number]["rankList"];

	console.log(applyingRule);
	var must = [];
	for(var i=0;i<applyingRule.length;i++){
		var rule_rank = applyingRule[i];
		var should = [];

			for (var j = 0; j < rules[i]["ranking"].length; j++) {
				if (rule_rank == rules[i]["ranking"][j]["rank"]) {
					var product_attribute_json = {};
					//if(rules[i]["product_attribute"] == "pdpData.articleAttributes.Prints & Patterns"){
					//	rules[i]["product_attribute"] = "pdpData.articleAttributes.Patterns"
					//}
					product_attribute_json[rules[i]["product_attribute"]] = rules[i]["ranking"][j]["product_attribute_value"];
					var match_json = {};
					match_json["match_phrase"] = product_attribute_json;
					should.push(match_json);
				}
			}
			var filtered = {
				filtered: {
					query: {
						bool: {
							should: should
						}
					}
				}
			};
			must.push(filtered);
	}
	return {
		index: 'products_data2',
		type: use_case.product_line.toLowerCase(),
		body: {
			query: {
				"bool": {
					must : must
				}
			}},
		size: 100
	};

}
app.get("/rules_test/clientdata",function(req, res){

	console.log("on client data get");
	
	var use_case = {};
	use_case.product_line = req.query['product_line'];
	use_case.age = req.query['age'];
	if(use_case.age == "36 ") use_case.age = "36+";
	use_case.body_shape = req.query['body_shape'];
	use_case.height = req.query['height'];
	use_case.skin_color = req.query['skin_color'];
	use_case.page_number = parseInt(req.query["pageNumber"]);

	console.log("before get mapped occasion");
	//var Size=req.query['size'];
	//console.log('Size is        :: ==> '+Size);
    //
    //
     //   var brand_sizes={ 'result_size' : [] };
     //          for(var i=0;i<sizeCharts.length;i++)
     //          {
     //               for(var j=0;j<sizeCharts[i]['size_chart'].length;j++)
     //               {
     //                   if(sizeCharts[i]['size_chart'][j]['To Fit Waist (INCHES)'] == Size &&(sizeCharts[i]['size_chart'][j]['Text Size']!=undefined))
     //                   {
	//						brand_sizes.result_size.push({
	//								"brand_name" :sizeCharts[i]['brand_name'],
	//								"size_chart" :sizeCharts[i]['size_chart'][j]
    //
	//						});
     //                   }
    //
     //               }
     //          }
     //          console.log("Brand_sizes =========>"+JSON.stringify(brand_sizes['result_size']));
         
	getMappedOccasion(use_case.product_line, req.query['occasion'], req.query['occasion_value'],function(occasion){
		use_case.occasion = occasion;
		console.log("after get mapped occasion");
		if(use_case.occasion.length > 0) {
			console.log(" befor get products from db");
			console.log(use_case);
			get_products(use_case, function (result_obj) {
				console.log("response from getPRODUCTS");
				var results = result_obj["product_list"];
				var appliedRules = result_obj["applied_rules"];
				var page_number = result_obj["page_number"];
			//	console.log(results.length, appliedRules.length);
				for (var i = 0; i < results.length; i++) {
					var product = results[i]["_source"];
					var totalScore = 0;
					for (var j = 0; j < appliedRules.length; j++) {
						var rule = appliedRules[j];
						var product_attribute = rule["product_attribute"];
						var fields = product_attribute.split(".");
						var product_attribute_value;
						if (fields.length == 3) {
							product_attribute_value = product[fields[0]][fields[1]][[fields[2]]];
						}
						if (fields.length == 2) {
							product_attribute_value = product[fields[0]][fields[1]];
						}
						var rankingList = rule["ranking"];
						for (var k = 0; k < rankingList.length; k++) {
							if (rankingList[k]["product_attribute_value"] == product_attribute_value) {
								totalScore += rankingList[k]["rank"];
								break;
							}
						}
					}
					results[i]["total_score"] = totalScore;
				}
				//console.log("style rules applying completed success ");
				var shownProductList = [];
				productSimilarity.getAllAdjectiveRules(function (ruleList) {
					//console.log("result product list length" ,results.length);
		//console.log("rules list length",ruleList.length);
		for (var i = 0; i < results.length; i++) {
						var getCnf=0;
						var product_id=results[i]["_id"];
                        //
						//for(var a=0;a<brand_sizes['result_size'].length;a++)
						//{
						//	console.log("========"+brand_sizes['result_size'][a]['brand_name']+"=="+results[i]._source.pdpData.brandName+"========")
						//	if(brand_sizes['result_size'][a]['brand_name']==results[i]._source.pdpData.brandName)
						//	{
						//		console.log("")
						//			for(var b=0;b<brand_sizes['result_size'][a]['size_chart'].length;b++)
						//			{
						//				for(var c=0;c<results[i]._source.pdpData.styleOptions.length;c++)
						//				{
						//					if(brand_sizes['result_size'][a]['size_chart'][b]==results[i]['_source']['pdpData']['styleOptions'][c]['value'] && (results[i]['_source']['pdpData']['styleOptions'][c]['inventoryCount'] != 0))
						//					getCnf=1;
						//				}
						//			}
						//	}
						//}


					if(1)
					{
								var message = {};
								var landingPageUrl = results[i]._source.pdpData.landingPageUrl;
								var styleImages = results[i]._source.pdpData.styleImages.default.path;
								message["landingPageUrl"] = landingPageUrl;
								message["styleImage"] = styleImages;
								message["id"] = results[i]["_id"];
								message["tags"] = [];
								message["totalScore"] = results[i]["total_score"];
								
					
								for(var j=0;j<ruleList.length;j++){
									var rule = ruleList[j];
									//console.log("rule id", ruleList[j]["_id"]);
									var product_line_name = rule["_source"]["product_line_name"].toLowerCase();
									if( product_line_name == use_case.product_line.toLowerCase()){
										var rule_attribute_dependency_list = rule["_source"]["attribute_dependencies"];
										var passed_dependency_count = 0;
										for(var k=0;k<rule_attribute_dependency_list.length;k++){
											var attribute_type = rule_attribute_dependency_list[k]["attribute_type"];
											var attribute_value_list =  rule_attribute_dependency_list[k]["attribute_value"];
											var type = getType(use_case.product_line.toLowerCase());
											var product_attribute_name = type["list"][attribute_type];
										var fields = product_attribute_name.split(".");
										var product_attribute_value;
										if(fields.length == 3) {
											product_attribute_value = results[i]["_source"][fields[0]][fields[1]][[fields[2]]];
										}
										if(fields.length == 2) {
											product_attribute_value = results[i]["_source"][fields[0]][fields[1]];
										}
											if(product_attribute_value != undefined) {
												for (var z = 0; z < attribute_value_list.length; z++) {
													if (product_attribute_value == attribute_value_list[z]) {
														passed_dependency_count++;
														break;
													}
												}
											}
										}
										if(passed_dependency_count == rule_attribute_dependency_list.length){
											message["tags"].push(rule["_source"]["adjective_value"]);
										var tag_array = message["tags"];
										message["tags"] = tag_array.filter(function(item, pos) {
											return tag_array.indexOf(item) == pos;
										})
										}
									}
								}

					}
					else
					{	
					 results.splice(i,1);
					}

						shownProductList.push(message);
					}
					shownProductList.sort(sort_by("totalScore", true, null));
					var responseObj = {};
					responseObj["result"] = shownProductList;
					responseObj["page_number"] = page_number;
					//console.log("sending result if ");
					res.send(responseObj);

				});
			});
		}else {
			var responseObj = {};
			responseObj["result"] = [];
			//console.log("sending result else");
			res.send(responseObj);
		}
	});
});
//for submit inspiration_name
app.get("/rules_test/submitName",function(req, res){

	console.log("on submit inspiration_name");
		var new_name=req.query['name'];
		var new_id=0;
		//to get new id
					var query = {
					index: 'styling_rules',
					type: 'inspiration_rules',
					body: {
						"_source": ["inspiration_id"],
						"query": {
							"match_all": {}
						},
						"size": 1,
						"sort": [ { "inspiration_id" : { "order" : "desc"} } ]
					}
				};
				
				elasticSearch.runQuery(query, function (results) {
					new_id=results[0]['_source']['inspiration_id'];
					new_id++;
					console.log('new id::' + new_id);
					console.log('new name :: '+ new_name);
					productSimilarity.insertInspiration(new_id, new_name, function (response) {
						console.log("maheh");
						res.send(response);
					});
				
					
				});
		
});
//submit new inpsiration name for tiles
app.get("/rules_test/submitInspName",function(req, res){

	console.log("on submit inspiration_name");
		var new_name=req.query['name'];
		productSimilarity.insertInspirationTile(new_name, function (response) {
			res.send(response);
		});
				
			
		
});	
//updating inspiration_rules
app.post("/rules_test/updateLinks",function(req,res){

	console.log(" on updateLinks .");

	if (req.method == 'POST') {
		var jsonString = '';
		console.log("on");
		req.on('data', function (data) {
			jsonString += data;
			console.log("dataa::>"+ jsonString);
		});
		req.on('end', function () {
			var data = JSON.parse(jsonString);
			var product_links = data["product_links"];
			var name=data['name'];
			console.log("product_links are  : " + product_links);
		
		var query = {
					index: 'styling_rules',
					type: 'inspiration_rules',
					body:{
							"_source" :["inspiration_id"],
							query: 
								{
									"match_phrase": {
									"inspiration_name": name
									}
								}	
						}

				};
				
				elasticSearch.runQuery(query, function (results) {
					id=results[0]['_source']['inspiration_id'];
					console.log('getting old id>>'+JSON.stringify(results));
					console.log('old id::' + id);
					console.log('new name :: '+ name);
					console.log('new data :' + product_links);
				productSimilarity.updateLinks(product_links,id,name, function (response) {
						console.log("maheh");
						res.send(response);
					});
				
					
				});
		});
	}
});
//update tiles
app.post("/rules_test/updateTiles",function(req,res){

	console.log(" on update tiles >> .");

	if (req.method == 'POST') {
		var jsonString = '';
		console.log("on");
		req.on('data', function (data) {
			jsonString += data;
			console.log("dataa::>"+ jsonString);
		});
		req.on('end', function () {
			var data = JSON.parse(jsonString);
			console.log('data in object >>',data);
		
				productSimilarity.updateTiles(data, function (response) {
						console.log("maheh");
						res.send(response);
					});
				
			
		});
	}
});
	//for inspiration_rules
app.get("/rules_test/callRules",function(req, res){

	console.log("on loadInspirationRules");
	var name=req.query['inspirationName'];
	console.log("id is ::==>" +name);
	var use_case = {};
	var query = {
		index: 'styling_rules',
		type: 'inspiration_rules',
		body: {

			query: 
			{
				  "match_phrase": {
           "inspiration_name": name
      			 }
			}
		}
	};
	console.log(query);
	elasticSearch.runQuery(query, function (results) {
		console.log('response::' +JSON.stringify(results));
			res.send(results);
		
	});

});	
//get inspiration view edit
app.get("/rules_test/getInspirationData",function(req, res){

	console.log("on loadInspirationRules");
	var name=req.query['inspirationName'];
	console.log("id is ::==>" +name);
	var use_case = {};
	var query = {
		index: 'styling_rules',
		type: 'inspiration_tiles',
		body: {

			query: 
			{
				  "match_phrase": {
           "inspiration_name": name
      			 }
			}
		}
	};
	console.log(query);
	elasticSearch.runQuery(query, function (results) {
		console.log('response::' +JSON.stringify(results));
			res.send(results);
		
	});

});	
//for getInspirationNames
app.get("/rules_test/getInspirationNames",function(req, res){

	console.log("on loadInspirationNames");

	var query = {
		index: 'styling_rules',
		type: 'inspiration_rules',
		body: {
			
			"query": {
						"match_all": {}
					}
			  }
	};
	console.log(query);
	elasticSearch.runQuery(query, function (results) {
			var names=[];
		for(var i=0;i<results.length;i++)
		{
			
			names[i] =	results[i]['_source']['inspiration_name'];
		}
			res.send(names);
			console.log('response::' +JSON.stringify(names));
	
		
	});

});	
//get inspiration_tiles
app.get("/rules_test/getInspirationTiles",function(req, res){

	console.log("on loadInspirationTiles");

	var query = {
		index: 'styling_rules',
		type: 'inspiration_tiles',
		body: {
			"_source": ["inspiration_name"  ],
			"query": {
						"match_all": {}
					},"size": 2000
			  }
	};
	console.log(query);
	elasticSearch.runQuery(query, function (results) {
		//console.log('response::>' +JSON.stringify(results));
			var names=[];
		for(var i=0;i<results.length;i++)
		{
			json={};
			json['id']=results[i]['_id'];
			json['name']=results[i]['_source']['inspiration_name'];
			names.push(json);
		}
		console.log('json is >',names);
			res.send(names);
		//	console.log('response::' +JSON.stringify(names));
	
		
	});

});
app.get("/rules_test/getTilesLinks",function(req, res){

	console.log("on load tiles links>>"+req.query['id'] );

	var query = {
		index: 'styling_rules',
		type: 'inspiration_styles',
		
		body: {
			
			"query": {
						"match_phrase": {
							"_id" :req.query['id']
						}
					}
			  }
	};
	console.log(query);
	elasticSearch.runQuery(query, function (results) {
			
			res.send(results[0]['_source']);
			console.log('response::' +JSON.stringify(results[0]['_source']));
	
	});

});
//fun1
app.get("/rules_test/inspirationFun1",function(req, res){

	console.log("on load fun1>>");
var key="product_filter."+req.query['key'];
var value=req.query['value'];
var flag=0;

if(req.query['min_price']=='na')
	flag=0;
else 
	flag=1;

console.log("flag is >  ",flag+":: min is >", req.query['min_price']);
console.log("key & value >>" +key +":"+value);
var abc = {}

abc["query"] = {}
abc["size"]=500;
abc["query"]["match_phrase"]={}
abc["query"]["match_phrase"][key] = value;
if(flag)
{
	abc["filter"]={}

	abc["filter"]["range"]={}
	abc["filter"]["range"]["product_filter.discount_price"]={}
	abc["filter"]["range"]["product_filter.discount_price"]["gte"]=req.query['min_price']
	abc["filter"]["range"]["product_filter.discount_price"]["lte"]=req.query['max_price']
}
var query = {
	index: 'products_data2',
	type: req.query['product_line'].toLowerCase(),
	body: abc
};
	console.log(JSON.stringify(query));
	elasticSearch.runQuery(query, function (results) {
		var shownProductList=[];
console.log("ON succes");
		for(var i=0;i<results.length;i++)
		{			
					var message = {};
					var link=results[i]._source.pdpData.landingPageUrl;
					 
					 if(link.includes("jabong")){
							var landingPageUrl = link;
							var styleImages = results[i]._source.pdpData.styleImages.default.path+"-pdp_slider_l.webp";
						}
					else {
						var landingPageUrl = link;
						var styleImages = results[i]._source.pdpData.styleImages.default.path;
						}
					message["landingPageUrl"] = landingPageUrl;
					message["discountedPrice"]=results[i]._source.pdpData.discountedPrice;
					message["styleImage"] = styleImages;
					message["id"] = results[i]["_id"];
					shownProductList.push(message);
					console.log("each message"+ message);
		}
			res.send(shownProductList);
			console.log('response::' +JSON.stringify(shownProductList));
	
	});

});
//get the brandwise count 

app.get("/rules_test/getBrandwiseCount",function(req, res){
	console.log("on getBrandwiseCount");
	var use_case = {};
	use_case.product_line = req.query['product_line'];

	var query = {
					index: 'products_data2',
					type: use_case.product_line.toLowerCase(),
					body: {
							"_source" : ["product_filter.brand","pdpData.discountedPrice"],
								query: {"match_all" : {	}},
								size:10000
						  }
				};
	console.log(query);
	elasticSearch.runQuery(query, function (results) {
		var data=[];
		var total_items=0;
		for(var i=0;i<results.length;i++)
		{
			var count="";
			var getCnf=1;
			var brand = results[i]["_source"]["product_filter"]["brand"];
			var price = results[i]["_source"]["pdpData"]["discountedPrice"];

			if(price <1000 & price>=0)
				count = 'tier1'
			else if(price <2000 & price>=1000)
				count = 'tier2'
			else if(price <3000 & price>=2000)
				count = 'tier3'
			else if(price <4000 & price>=3000)
				count = 'tier4'
			else if( price>=4000)
				count = 'tier5'

			for(var j=0;j<data.length;j++)
			{
					if(brand == data[j]['brand_name'])
					{
						data[j]['count'][count]+=1;
						getCnf=0;
						break;

					}
			}
			if(getCnf)
			{	
				var val1=0,val2=0,val3=0,val4=0,val5=0;
				if(count == 'tier1') val1=1;
				else if(count == 'tier2') val2=1;
				else if(count == 'tier3') val3=1;
				else if(count == 'tier4') val4=1;
				else if(count == 'tier5') val5=1;
				data.push({
									"brand_name" :brand,
									"count" :	{
												"tier1" : val1,
												"tier2" : val2,
												"tier3" : val3,
												"tier4" : val4,
												"tier5" : val5
												},
									"result" : {
													"max1"  :0,
													"max1_percent" : 0,
													"max2"  : 0,
													"max2_percent" : 0
												},
									"allocated" : 0
									
							});
			}
		}
		 for(var i=0;i<data.length;i++)
		{
			var arr=[];
			for (var key in data[i].count)
				arr.push([key, data[i]['count'][key]])

			arr.sort(function(a, b) {
				return b[1] - a[1]
			})
			var temp=arr[0][0];
			temp=temp.replace( /\D+/g, '');
			var temp2= parseInt(temp, 10);
			data[i]['result']['max1']=temp2;
			var temp=arr[1][0];
			temp=temp.replace( /\D+/g, '');
			var temp2= parseInt(temp, 10);
			data[i]['result']['max2']=temp2;

			
			var total=0;
			for(var l=0;l<arr.length;l++)
			{
				total=total+arr[l][1];
			}
			total_items=total_items+total;
			
				data[i]['result']['max1_percent']=100*(arr[0][1]/total);
				data[i]['result']['max2_percent']=100*(arr[1][1]/total);

				if(data[i]['result']['max1_percent']>= 70)
				data[i]['allocated'] = data[i]['result']['max1']
				else 
				{	
					if((data[i]['result']['max1_percent']>= 30) && (data[i]['result']['max2'] > data[i]['result']['max1']))
					data[i]['allocated'] = data[i]['result']['max2']
					else 
					data[i]['allocated'] = data[i]['result']['max1']
				}
			
		}
		console.log('total items are >>'+ total_items);
		res.send(data);
	});

});
app.get("/rules_test/getCount",function(req, res){

	console.log("on getCount");
	var use_case = {};
	use_case.product_line = req.query['product_line'];

	var query = {
		index: 'products_data2',
		type: use_case.product_line.toLowerCase(),
		body: {
			query: {
				"match_all" : {
				}	
			},
			size: 2000
		}
	};
	console.log(query);
	var Total_tags={};
	elasticSearch.runQuery(query, function (results) {
		productSimilarity.getAllAdjectiveRules(function (ruleList) {
		for (var i = 0; i < results.length; i++) {
			for(var j=0;j<ruleList.length;j++){
				var rule = ruleList[j];
				console.log(rule["_id"]);
				var product_line_name = rule["_source"]["product_line_name"].toLowerCase();
				if( product_line_name == use_case.product_line.toLowerCase()){
					var rule_attribute_dependency_list = rule["_source"]["attribute_dependencies"];
					var passed_dependency_count = 0;
					for(var k=0;k<rule_attribute_dependency_list.length;k++){
			
						var attribute_type = rule_attribute_dependency_list[k]["attribute_type"];
						var attribute_value_list =  rule_attribute_dependency_list[k]["attribute_value"];
			
						var type = getType(use_case.product_line.toLowerCase());
						var product_attribute_name = type["list"][attribute_type];
						var fields = product_attribute_name.split(".");
						var product_attribute_value;
						if(fields.length == 3) {
							product_attribute_value = results[i]["_source"][fields[0]][fields[1]][[fields[2]]];
						}
						if(fields.length == 2) {
							product_attribute_value = results[i]["_source"][fields[0]][fields[1]];
						}
						if(product_attribute_value != undefined) {
							for (var z = 0; z < attribute_value_list.length; z++) {
								if (product_attribute_value == attribute_value_list[z]) {
									passed_dependency_count++;
									break;
								}
							}
						}
					}
					if(passed_dependency_count == rule_attribute_dependency_list.length){
						var adjective=rule["_source"]["adjective_value"];
						console.log(Total_tags[product_attribute_value]);
						if( Total_tags[adjective] == undefined)
							Total_tags[adjective] = 0;
						else
							Total_tags[adjective] += 1;
					}
				}
			}
		}
			var responseObj = {};
			responseObj["Total_tags"]=Total_tags;
			console.log("sending result");
			res.send(responseObj);
		});	
	});

});




function getMappedOccasion(product_line, occasion, occasion_value,callback) {
	if(occasion_value == 'no')
	callback && callback(occasion);
	else
	{
			productSimilarity.getAllOccasions(function(occasion_map){
			var db_occasion = "";
			for (var i = 0; i < occasion_map.length; i++) {
				var occasion_object = occasion_map[i]["_source"];
				if(occasion_object["product_line_name"].toLowerCase() ==  product_line.toLowerCase()){
					var occasion_value_list = occasion_object["occasion_value_list"];
					for(var j=0;j<occasion_value_list.length;j++){
						if(occasion_value_list[j] == occasion+"_"+occasion_value){
							db_occasion = occasion_object["occasion_value"];
							break;
						}
					}
				}
			}
			callback && callback(db_occasion);
		})
	}
}
