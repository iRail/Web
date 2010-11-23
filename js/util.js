var _ = {
	t : function(time) {
		var time = time.getUTCHours ? time : new Date(time*1000);
		return (time.getUTCHours()<10?'0':'')+time.getUTCHours()+':'+(time.getUTCMinutes()<10?'0':'')+time.getUTCMinutes();
	},
	h : function(text) {
		return text.replace('&', '&amp;').replace('<', '&lt;');
	}
}