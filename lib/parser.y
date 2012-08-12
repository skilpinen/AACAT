/* Samin parseri */

%{
var Mongo = require('./mongo.js').Mongo;
var mongo = new Mongo('localhost',27017);
solveField = function(field){
	var enumerateKeys = {mapreduce : "crew",map : "function() {for (var key in this) { emit(key, null); }}",reduce : "function(key, stuff){ return null; }",out: "crew" + "_keys"}
	mongo.db.executeDbCommand(enumerateKeys, function(err, res) {
		mongo.findKeys(function(err,docs){
			docs.map(function(key){
				console.log(JSON.parse('{"'+key+'":"'+field+'"}'))
				mongo.findByQuery(JSON.parse('{"'+key+'":"'+field+'"}'),function(err,doc){
					console.log(key)
					// TODO: algorithm to decide whether field is ambigious
					console.log(doc.length)
				})
				console.log(key)
			})
		})
	})
	return('rank');
}
%}

/* lexical grammar */
%lex

%%
\s+                   /* skip whitespace */
"count"			return 'COUNT';
"crew"			return 'CREW';
"officer"		return 'OFFICER';
<<EOF>>               return 'EOF';
/lex

%start expressions

%% /* language grammar */

expressions
	: e EOF
		{return($1);}
	;

WHAT:	/* empty */
	| CREW
	| OFFICER
	;	

e
	: COUNT WHAT
		%{var query = '{"command":"count","query":{"' + solveField($2) + '":"' + $2 + '"}}';$$ = query;%}
    	;


