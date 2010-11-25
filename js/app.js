// iRail Web - Mathias Baert 2010 - Some kind of free licence
//
// IRail.data: Non-dynamic data used in the iRail client
// Railway station data sourced from original iRail client

(function(){

var App = function() {
	
	var initialize = function() {
		this.navigation();
		this.search();
		this.liveboard();
	};
	
	this.navigation = function() {
		var showSearch    = _.byId('show_search');
		var showLiveboard = _.byId('show_liveboard');
		var searchPane    = _.byId('search_pane');
		var liveboardPane = _.byId('liveboard_pane');

		var doShowSearch = function() {
			_.addClass(showSearch, 'current');
			_.removeClass(showLiveboard, 'current');
			_.show(searchPane);
			_.hide(liveboardPane);
		};
		_.addEvent(showSearch, 'click', doShowSearch);

		var doShowLiveboard = function() {
			_.removeClass(showSearch, 'current');
			_.addClass(showLiveboard, 'current');
			_.hide(searchPane);
			_.show(liveboardPane);
		};
		_.addEvent(showLiveboard, 'click', doShowLiveboard);
		
		doShowSearch();
	};
	
	this.search = function() {
		// update HTML from template
		_.update('search');
		
		// HTML elements
		var form = _.byId('search_form');
		var departure = form['departure'];
		var arrival   = form['arrival'];
		var minute    = form['minute'];
		var hour      = form['hour'];
		var day       = form['day'];
		var month     = form['month'];
		var year      = form['year'];
		var departureOrArrival = form['departure-or-arrival'];
		
		autoComplete(departure, IRailData.stations);
		autoComplete(arrival, IRailData.stations);

		form.onsubmit = function() {
			if (!departure.value || !arrival.value) {
				return false;
			}
			
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
					_.update('search_results', data);
					document.location.hash = "search_results";
				},
				'error'     : function(data) {
					_.update('search_results', data);
					document.location.hash = "search_results";
				}
			});
			return false;
		}
	};
	
	this.liveboard = function() {
		// update HTML from template
		_.update('liveboard');
		
		// HTML elements
		var form = _.byId('liveboard_form');
		var station = form['station'];
		
		autoComplete(station, IRailData.stations);

		form.onsubmit = function() {
			if (!station.value) {
				return false;
			}
						
			IRail.liveboard({
				'station'  : station.value,
				'departAt' : new Date(),
				'success'  : function(data) {
					_.update('liveboard_results', data);
					document.location.hash = "liveboard_results";
				},
				'error'    : function(data) {
					_.update('liveboard_results', data);
					document.location.hash = "liveboard_results";
				}
			});
			return false;
		}
	};
	
	initialize.apply(this, arguments);
};

window.onload = function(){new App();};

})();