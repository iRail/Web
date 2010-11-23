// iRail Web - Mathias Baert 2010 - Some kind of free licence
//
// util.js: some handy functions, cuz I couldn't find a light enough library

var _ = {
	t : function(time) {
		var time = time.getUTCHours ? time : new Date(time*1000);
		return (time.getUTCHours()<10?'0':'')+time.getUTCHours()+':'+(time.getUTCMinutes()<10?'0':'')+time.getUTCMinutes();
	},
	h : function(text) {
		return text.replace('&', '&amp;').replace('<', '&lt;');
	},
	update : function(name, data) {
		var el = document.getElementById(name);
		el.innerHTML = _.template(name+'_template', data||{});
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
// todo: replace with other concise event handling helpers, with licence
function addEvent( obj, type, fn ) {
  if ( obj.attachEvent ) {
    obj['e'+type+fn] = fn;
    obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
    obj.attachEvent( 'on'+type, obj[type+fn] );
  } else
    obj.addEventListener( type, fn, false );
}
function removeEvent( obj, type, fn ) {
  if ( obj.detachEvent ) {
    obj.detachEvent( 'on'+type, obj[type+fn] );
    obj[type+fn] = null;
  } else
    obj.removeEventListener( type, fn, false );
}
