var Mongo = require('./mongo.js').Mongo;
var mongo = new Mongo('localhost',27017)
var parser = require('./parser.js').parser

exports.index = function(req, res){
	  // GET homepage
    console.log('heh')
    res.render('interface', { title: 'Adeptus Administrator resource management cogitator' })
  }

exports.crew_search=function(req, res){
    // GET search homepage
    res.render('crew_search', { title: 'Crew search' })
  }

exports.crew_query=function(req, res){
  // POST from search page
  var query = req.body;
  console.log(query)

  mongo.findByQuery(query,function(err,docs){
    console.log(docs)
		//res.send(docs);
    res.writeHead(200, "OK", {'Content-Type': 'text/html'});
		res.render('search_res',{locals:{title:'Search results',crew:docs}});
	}); 
  }

exports.ui = function(req, res){
  console.log(req.body)
  console.log(parser.parse(req.body['command']));
  var command = JSON.parse(parser.parse(req.body['command']))
  if (command['command']=="count"){
    console.log(command['query'])
    mongo.findByQuery(command['query'],function(err,docs){
      console.log(docs.length)
		  res.send({'response':docs});
	  });
  }
}

