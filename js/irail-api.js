// iRail Web - Mathias Baert 2010 - Some kind of free licence
//
// IRail: JavaScript wrapper for the iRail REST api (note to self: verify that it really is REST)
// started from http://mathiasbynens.be/demo/irail-api

if (IRail) {
	throw("'IRail' already exists");
}

var IRail = (function(){
	var baseUri = 'http://dev.api.irail.be';

	var uniqueGlobalNameCounter = {};
	var uniqueGlobalName = function(name) {
		uniqueGlobalNameCounter[name] = uniqueGlobalNameCounter[name] ? uniqueGlobalNameCounter[name]++ : 1;
		// just to be sure: find a name which is not in use yet.
		for (; window[name+uniqueGlobalNameCounter[name]]; uniqueGlobalNameCounter[name]++) {}
		return name+uniqueGlobalNameCounter[name];
	}

	var insertScript = function(uri, callbackSuccess, callbackError) {
		var callbackName = uniqueGlobalName('iRailCallback');

		window[callbackName] = function() {
			if (arguments[0].error) {
				callbackError.apply(null, arguments);
			} else {
				callbackSuccess.apply(null, arguments);
			}
			delete window[callbackName];
			var elScript = document.getElementById(callbackName);
			elScript.parentNode.removeChild(elScript);
		};

		var elScript = document.createElement('script');
		elScript.id  = callbackName;
		elScript.src = uri+'&callback='+callbackName;
	
		document.body.appendChild(elScript);
	}

	// object structure should be predictable
	var processResponseConnections = function(data) {
		// 1.   Normalize vias:
		for (var i=0; i<data.connection.length; i++) {
		// 1.1. vias object must exist
			if (!data.connection[i].vias) {
				data.connection[i].vias = {'number':'0', 'via':[]};
			}
		// 1.2. and it must have an array of via's
			if (!data.connection[i].vias.via.pop) {
				data.connection[i].vias.via = [data.connection[i].vias.via];
			}
		}
		// 2.  Normalize error property
		data.error = false;
		
		return data;
	}
	
	return {
		// IRail.connections({from:'GENT', to:'ANTWERPEN', success:function(data){...}})
		// takes 1 parameters object with:
		// - departure;    string;    required;  name of the station of departure
		// - arrival;      string;    required;  name of the station of arrival
		// - departAt;     date;      this or arriveAt is required;  the prefered time of departure
		// - arriveAt;     date;      this or departAt is required;  the prefered time of arrival
		// - transport;    array of strings;  optional;  possible values ['train', 'bus', 'taxi'];  methods of transportation which are acceptable
		// - limit;        number;    optional, default=3;  the amount of results to return; this is not guaranteed: if 2 connections have the same arrival time, they will be counted as 1
		// - success;      function;  required;  callback in case of success
		// - error;        function;  optional;  callback in case of error
		connections : function(args) {
			if (!args['departure']) {throw('Missing argument "departure"');}
			if (!args['arrival'])   {throw('Missing argument "arrival"');}
			if (!args['departAt'] && !args['arriveAt']) {throw('Missing argument "departAt" or "arriveAt"');}
		
			if (!args['success']) {throw('Missing argument "success"');}

			var limit = Number(args['limit']) || 3;
			var date  = (args['departAt'] || args['arriveAt']);

			var uri = baseUri+'/connections/?format=json'+
				'&from='+encodeURIComponent(args['departure'])+
				'&to='+encodeURIComponent(args['arrival'])+
				'&date='+_.t(date, 'ddmmyy')+
				'&time='+_.t(date, 'mmhh')+
				'&timeSel='+(args['departAt'] ? 'depart' : 'arrive')+
				'&results='+limit+
				'&typeOfTransport='+encodeURIComponent((args['transport']||[]).join(';'));

			insertScript(
				uri,
				function(data) {
					args['success'](processResponseConnections(data));
				},
				args['error']
			);
		}
	};
})();
