// iRail Web - Mathias Baert 2010 - Some kind of free licence
//
// IRail.data: Non-dynamic data used in the iRail client
// Railway station data sourced from original iRail client

(function(){

var App = function() {
	
	var initialize = function() {
		this.search();
	};
		
	this.search = function() {
		_.update('search');
		
		var form = document.getElementById('form');
		var departure = form['departure'];
		var arrival   = form['arrival'];

		form.onsubmit = function() {
			IRail.connections({
				'departure' : departure.value,
				'arrival'   : arrival.value,
				'success'   : function(data) {
					_.update('results', data);
				}
			});
			return false;
		}
	};
	
	initialize.apply(this, arguments);
};

window.onload = function(){new App();};

})();