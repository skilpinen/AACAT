
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./lib/routes.js');
var url = require("url");
var http = require("http");

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	app.use(express.errorHandler()); 
});

// Routes
//Mongo=new Mongo('localhost',27017)

app.get('/', routes.index);
app.get('/crew_search', routes.crew_search);
app.post('/crew_search', routes.crew_query);
app.post('/ui', routes.ui);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
