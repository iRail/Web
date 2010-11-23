// iRail Web - Mathias Baert 2010 - Some kind of free licence
//
// IRail: JavaScript wrapper for the iRail REST api (note to self: verify that it really is REST)
// started from http://mathiasbynens.be/demo/irail-api

if (IRail) {
	throw("'IRail' already exists");
}

var IRail = (function(){
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
		// IRail.connections({from:'GENT', to:'ANTWERPEN', success:function(data){...}})
		// takes 1 parameters object with:
		// - departure;    string;    required;  name of the station of departure
		// - arrival;      string;    required;  name of the station of arrival
		// - success;      function;  required;  callback in case of success
		// TODO
		// - error;        function;  optional;  callback in case of error
		// - departAt;     Date;      this or arriveAt is required;  the prefered time of departure
		// - arriveAt;     Date;      this or departAt is required;  the prefered time of arrival
		// - transport;    Array of Strings;  optional;  possible values ['train', 'bus', 'taxi'];  methods of transportation which are acceptable
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
})();
