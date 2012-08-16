GLOBAL.DEBUG = true;

sys = require("util");
test = require("assert");

//var Db = require('../node_modules/mongodb/lib/mongodb').Db,
//  Connection = require('../node_modules/mongodb/lib/mongodb').Connection,
//    Server = require('../node_modules/mongodb/lib/mongodb').Server;

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

//var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
//var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

//sys.puts("Connecting to Mongo at " + host + ":" + port);

// var db = new Db('npcManager', new Server(host, port, {}), {native_parser:false});

Mongo = function(host,port){
	this.db= new Db('npcManager', new Server(host, port, {auto_reconnect: true}, {}));
	this.db.open(function(){});
}

Mongo.prototype.getCollection= function(callback) {
	  this.db.collection('crew', function(error, collection) {
	    if( error ) callback(error);
	    else callback(null, collection);
	  });
};

Mongo.prototype.Keys= function(callback) {
	  this.db.collection('crew_keys', function(error, collection) {
	    if( error ) callback(error);
	    else callback(null, collection);
	  });
};



Mongo.prototype.findAll = function(callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
    	  collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

Mongo.prototype.findAmb = function(callback) {
    this.Keys(function(error, collection) {
      if( error ) callback(error)
      else {
    	  collection.find().toArray(function(error,results){
          if( error ) callback(error)
          else callback(null, results)
        })
      }
    });
};


Mongo.prototype.findByQuery = function(id, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
//    	  var tmpQuery = JSON.parse("{"+id+"}")
    	  collection.find(id).toArray(function(error, results) {
              if( error ) callback(error)
              else callback(null, results)
            });
      }
    });
};

exports.Mongo=Mongo;
