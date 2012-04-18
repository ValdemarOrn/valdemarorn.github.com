
$(document).ready(function(){

	alert('ping');
	var text = $('#content').html();

	var converter = new Showdown.converter();
	var html = converter.makeHtml(text);

	alert(html);
	
});