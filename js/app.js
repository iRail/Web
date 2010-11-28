// iRail Website, mobile and desktop; Get public transit information for Belgium
// Copyright (C) 2010 Mathias Baert
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
// iRail Web - Mathias Baert 2010 - Some kind of free licence

// App: manages the GUI and user interaction

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
		var showInfo      = _.byId('show_info');
		var searchPane    = _.byId('search_pane');
		var liveboardPane = _.byId('liveboard_pane');
		var infoPane      = _.byId('info_pane');

		var showPane = function(name) {
			_[name=='search'    ? 'addClass' : 'removeClass'](showSearch,    'current');
			_[name=='liveboard' ? 'addClass' : 'removeClass'](showLiveboard, 'current');
			_[name=='info'      ? 'addClass' : 'removeClass'](showInfo,      'current');

			_[name=='search'    ? 'show' : 'hide'](searchPane);
			_[name=='liveboard' ? 'show' : 'hide'](liveboardPane);
			_[name=='info'      ? 'show' : 'hide'](infoPane);
		};
		
		_.addEvent(showSearch,    'click', function(){showPane('search')});
		_.addEvent(showLiveboard, 'click', function(){showPane('liveboard')});
		_.addEvent(showInfo,      'click', function(){showPane('info')});
		
		showPane('search');
	};
	
	this.search = function() {
		// update HTML from template
		_.update('search');
		
		// HTML elements
		var form      = _.byId('search_form');
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