var Mongo = require('./mongo.js').Mongo;
var mongo = new Mongo('localhost',27017)
var parser = require('./parser.js').parser

solveField = function(field,callback){
	var enumerateKeys = {mapreduce : "crew",map : "function(){for(var key in this){if(this[key]=='"+field+"'){ emit(key, 1); } else { emit(key, 0); } }  }",reduce : "function(key,values){var count = 0;values.map(function(value){count += value});return count;}",out: "crew" + "_keys"};
	mongo.db.executeDbCommand(enumerateKeys, function(err, res) {
		mongo.findAmb(function(err,docs){
			//console.log(docs)
			callback(docs)
		})
	})
}

exports.index = function(req, res){
	  // GET homepage
    console.log('heh')
    res.render('interface', { title: 'Adeptus Administrator Cogitator Access Terminal' })
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
  //console.log(req.body)
  //console.log(parser.parse(req.body['command']));
  var command = JSON.parse(parser.parse(req.body['command']))
  console.log(command)
  solveField(command['what'],function(result){
    var amb = 0;
    var keys = [];
    console.log(result)
    result.map(function(item){
      if (item['value']>0){
        amb += 1
        keys.push(item['_id'])
      }
    })
    if (amb==0){
      response = 'Do not disturb holy machine sprits of data coils with irrational queries regarding non-existing data.'
      res.send({'response':response})
    } else if (amb==1 && command['withwhat']==undefined){
        mongo.findByQuery(JSON.parse('{"'+keys[0]+'":"'+command['what']+'"}'),function(err,docs){
          console.log(command)
          if (command['command']=='COUNT'){
            res.send({'response':docs.length});
          } else if (command['command']=='LIST') {
            res.send({'response':JSON.stringify(docs)})
          }
	        }); 
    } else if (amb>1 && !(command['withwhat'])){
      response = 'The question is controversial as '+command['what']+' can be interpreted as '+keys.join()
      res.send({'response':response}) 
    } else if (!(command['withwhat']==undefined)){
          mongo.findByQuery(JSON.parse('{"'+command['withwhat']+'":"'+command['what']+'"}'),function(err,docs){
          if (command['command']=='COUNT'){
            res.send({'response':docs.length});
          } else if (command['command']=='LIST') {
            res.send({'response':JSON.stringify(docs)})
          }
	        }); 

    }

  })
}
