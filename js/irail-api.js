// iRail Demo application - Mathias Baert 2010 - Some kind of free licence
//
// IRail.api: JavaScript wrapper for the iRail REST api (note to self: verify that it really is REST)
// started from http://mathiasbynens.be/demo/irail-api

if (IRail) {
	throw("'IRail' already exists");
}
if (IRail && IRail.api) {
	throw("'IRail.api' already exists");
}

var IRail = {
	api : (function(){
		var baseUrl = 'http://dev.api.irail.be';
	
		var uniqueGlobalNameCounter = {};
		var uniqueGlobalName = function(name) {
			uniqueGlobalNameCounter[name] = uniqueGlobalNameCounter[name] ? uniqueGlobalNameCounter[name]++ : 1;
			// just to be sure: find a name which is not in use yet.
			for (; window[name+uniqueGlobalNameCounter[name]]; uniqueGlobalNameCounter[name]++) {}
			return name+uniqueGlobalNameCounter[name];
		}
	
		var insertScript = function(uri, callbackSuccess) {
			var callbackSuccessName = uniqueGlobalName('iRailCallbackSuccess');

			window[callbackSuccessName] = function() {
				callbackSuccess.apply(null, arguments);
				delete window[callbackSuccessName];
				var elScript = document.getElementById(callbackSuccessName);
				elScript.parentNode.removeChild(elScript);
			};

			var elScript = document.createElement('script');
			elScript.id  = callbackSuccessName;
			elScript.src = uri+'&callback='+callbackSuccessName;
		
			document.body.appendChild(elScript);
		}

		// object structure should be predictable
		var processResponseConnections = function(data) {
			for (var i=0; i<data.connection.length; i++) {
				// 1.   Normalize vias:
				// 1.1. vias object must exist
				if (!data.connection[i].vias) {
					data.connection[i].vias = {'number':'0', 'via':[]};
				}
				// 1.2. and it must have an array of via's
				if (!data.connection[i].vias.via.pop) {
					data.connection[i].vias.via = [data.connection[i].vias.via];
				}
			}
			return data;
		}
			
		return {
			// IRail.api.connections({from:'GENT', to:'ANTWERPEN', success:function(data){...}})
			// TODO: add argument 'error', a callback in case of failure
			connections : function(args) {
				if (!args['from'])    {throw('Missing argument "from"');}
				if (!args['to'])      {throw('Missing argument "to"');}
			
				// if (args['departure'] && args['arrival'])
				// &date=311210&time=2359&timeSel=arrive or depart&typeOfTransport=train;bus;taxi 
			
				if (!args['success']) {throw('Missing argument "success"');}

				var limit = args['limit'] || 3;

				insertScript(
					baseUrl+'/connections/?format=json&from='+args['from']+'&to='+args['to']+'&results='+limit,
					function(data) {
						args['success'](processResponseConnections(data));
					}
				);
			}
		};
	})()
}