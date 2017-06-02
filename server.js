var express = require('express');
var app = express();

app.use(express.static(__dirname ));

app.get('*', function(req, res, next) {

	 // Just send the index.html for other files to support HTML5Mode
  	res.sendFile('/index.html', { root: __dirname });
});
var port = 7997;
app.listen(port); //the port you want to use
console.log('Server running at localhost:' + port);