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

// util.js: some handy functions, cuz I couldn't find a light enough library

var _ = {
	t : function(time, format) {
		var time = time.getHours ? time : new Date(time*1000);
		var isDuration = time.getFullYear() == 1970;
		// as long as we don't need more than a handful of formats, this is acceptable
		switch (format) {
			case 'ddmmyy':
				return _.padZeroes(time.getDate())+_.padZeroes(time.getMonth()+1)+(time.getYear()%100);
				break;
			case 'mmhh':
				return _.padZeroes(time.getHours())+_.padZeroes(time.getMinutes());
				break;
			case 'hh:mm':
				if (isDuration) {
					return _.padZeroes(time.getUTCHours())+':'+_.padZeroes(time.getUTCMinutes());
				} else {
					return _.padZeroes(time.getHours())+':'+_.padZeroes(time.getMinutes());
				}
				break;
			case '+hh:mm':
				if (isDuration) {
					if (time.getUTCHours()) {
						return '+'+time.getUTCHours()+':'+_.padZeroes(time.getUTCMinutes());
					}	else {
						return '+'+time.getUTCMinutes();
					}
				}
				break;
		}
	},
	padZeroes : function(number, places) {
		var n, places=places||2;
		for (n=number.toString(); n.length<places; n='0'+n){}
		return n;
	},
	h : function(text) {
		return text.toString().replace('[object Object]', '').replace('&', '&amp;').replace('<', '&lt;');
	},
	update : function(name, data) {
		var el = document.getElementById(name);
		el.innerHTML = _.template(name+'_template', data||{});
	},
	partial : function(name, data) {
		return _.template('_'+name, data||{});
	},
	stopEvent : function(ev) {
		ev.cancelBubble = true;
		ev.stopPropagation && ev.stopPropagation();
		ev.preventDefault();
	},
	show : function(el) {
		el.style.display = '';
	},
	hide : function(el) {
		el.style.display = 'none';
	},
	byId : function(id) {
		return document.getElementById(id);
	},
	addClass : function(el, className) {
		el.className = el.className+' '+className;
	},
	removeClass : function(el, className) {
		el.className = el.className.split(className).join(' ');
	},
	// http://www.quirksmode.org/js/events_properties.html#target
	target : function(ev) {
		var target;
		if (ev.target) {
			target = ev.target;
		}	else if (ev.srcElement) {
			target = ev.srcElement;
		}
		if (target.nodeType == 3) {
			// defeat Safari bug
			target = target.parentNode;
		}
		return target;
	}
};


// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
// http://ejohn.org/blog/javascript-micro-templating/
// Mathias Baert: 1. renamed 'tmpl' to 'template'
//                2. add function to 'module' instead of window
//                3. added the CDATA handling from jqote2 (also MIT licenced)
(function(module){
  var cache = {};
 
  module.template = function template(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        template(document.getElementById(str).innerHTML.replace(/^\s*<!\[CDATA\[\s*|\s*\]\]>\s*$|[\r\n\t]/g, '')) :
     
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
       
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
       
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
   
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})(_);


// source: http://ejohn.org/projects/flexible-javascript-events/ - licence unknown
// added the obj and type as array functionality - Mathias Baert
// todo: replace with other concise event handling helpers, with licence
_.addEvent = function addEvent( obj, type, fn ) {
	if (obj.pop) {
		for (var i=0; i<obj.length; i++) {
			_.addEvent(obj[i], type, fn);
		}
		return;
	}
	if (type.pop) {
		for (var i=0; i<type.length; i++) {
			_.addEvent(obj, type[i], fn);
		}
		return;
	}
  if ( obj.attachEvent ) {
    obj['e'+type+fn] = fn;
    obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
    obj.attachEvent( 'on'+type, obj[type+fn] );
  } else
    obj.addEventListener( type, fn, false );
};
_.removeEvent = function removeEvent( obj, type, fn ) {
  if ( obj.detachEvent ) {
    obj.detachEvent( 'on'+type, obj[type+fn] );
    obj[type+fn] = null;
  } else
    obj.removeEventListener( type, fn, false );
};
