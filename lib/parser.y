/* Samin parseri */

/* lexical grammar */
%lex

%%
\s+                   /* skip whitespace */
[Cc]"ount"		return 'COUNT';
[Ll]"ist"		return 'LIST';
"not"			return 'NOT'
"or"			return 'OR'
"and"			return 'AND'
"with"			return 'WITH';
[0-9a-zA-Z_-]+		return 'WHAT';
<<EOF>>               return 'EOF';
/lex

%start query

%% /* language grammar */

query
	: count EOF
		{return($1);}
	| list EOF
		{return($1);}
	;

DEF
	: WITH WHAT -> [$1, $2]
	;

conjunction
	: AND     -> "and"
	| OR      -> "or"
	| AND NOT -> "not"
	;

count
	: COUNT DEF WHAT
		%{var tmp = '{"command":"COUNT","what":"' + $3 + '","withwhat":"'+$2[1]+'"}';$$=tmp;%}
	| COUNT WHAT
		%{var tmp = '{"command":"COUNT","what":"' + $2 + '"}';$$=tmp;%}
	;

list
	: LIST WHAT
		%{var tmp = '{"command":"LIST","what":"' + $2 + '"}';$$=tmp;%}
	| LIST DEF WHAT
		%{var tmp = '{"command":"LIST","what":"' + $3 + '","withwhat":"'+$2[1]+'"}';$$=tmp;%}
	;

