// iRail Demo application - Mathias Baert 2010 - Some kind of free licence
//
// IRail.data: Non-dynamic data used in the iRail client
// Railway station data sourced from original iRail client

window.onload = function() {
	var form = document.getElementById('form');
	var from = form['from'];
	var to   = form['to'];
	
	form.onsubmit = function() {
		IRail.api.connections({
			'from'    : from.value,
			'to'      : to.value,
			'success' : function(data) {
				update('results', data);
			}
		});
		return false;
	}
	
	var update = function(name, data) {
		console.log(data)
		var el = document.getElementById(name);
		el.innerHTML = tmpl(name+'_template', data);
	};
}