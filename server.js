var express = require('express');
var app = express();
/*
var redis = require("redis"),
client = redis.createClient(),
cacheableStatusCodes = {200: true, 302: true, 404: true};
*/
app.use('/static', express.static('public'));
app.use(require('prerender-node'));
//app.use(express.static(__dirname ));

app.get('/', function(req, res, next) {
	res.sendFile('/home.html', { root: __dirname });
});
app.get('/find/women/*', function(req, res, next){
	res.sendFile('/wedding-dresses-for-women.html', { root: __dirname });
});
app.get('/find/*', function(req, res, next){
	res.sendFile('/wedding-dresses-for-women.html', { root: __dirname });
});

app.get('/product/*/*', function(req, res, next){
  //console.log("going to product page.");
  res.sendFile('/product_page.html', { root: __dirname });
});



app.get('/sitemap.xml', function(req, res, next){
	res.sendFile('/sitemap.xml', { root: __dirname });
});

app.get('/t&c.html', function(req, res, next){
	res.sendFile('/t&c.html', { root: __dirname });
});

app.get('/mweb', function(req, res, next){
	res.sendFile('/index_mobile.html', { root: __dirname });
});

app.get('/robots.txt', function(req, res, next){
	res.sendFile('/robots.txt', { root: __dirname });
});


/*app.get('/find/*', function(req, res, next) {
  	console.log("Sending obsolete index");
	res.sendFile('/index.html', { root: __dirname });
});*/
var port = 7999;
app.listen(port); //the port you want to use
console.log('Server running at localhost:' + port);
