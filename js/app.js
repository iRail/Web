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
		// update HTML from template
		_.update('search');
		
		// HTML elements
		var form = document.getElementById('form');
		var departure = form['departure'];
		var arrival   = form['arrival'];
		var minute    = form['minute'];
		var hour      = form['hour'];
		var day       = form['day'];
		var month     = form['month'];
		var year      = form['year'];
		var departureOrArrival = form['departure-or-arrival'];

		form.onsubmit = function() {
			var date = new Date(year.value, (month.value-1), day.value, hour.value, minute.value);
			
			var departureOrArrivalValue;
			for (var i=0; i<departureOrArrival.length; i++) {
				if (departureOrArrival[i].checked) {
					departureOrArrivalValue = departureOrArrival[i].value;
				}
			}
			
			IRail.connections({
				'departure' : departure.value,
				'arrival'   : arrival.value,
				'departAt'  : (departureOrArrivalValue=='departure' ? date : undefined),
				'arriveAt'  : (departureOrArrivalValue=='arrival'   ? date : undefined),
				'success'   : function(data) {
					_.update('results', data);
					document.location.hash = "results";
				}
			});
			return false;
		}
	};
	
	initialize.apply(this, arguments);
};

window.onload = function(){new App();};

})();