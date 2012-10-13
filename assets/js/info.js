var get = function(name) {
	var xhr = new XMLHttpRequest(),
	    res;
	name = unescape(name.replace(/ /g, '+').toLowerCase());
	xhr.open("GET", "http://mal-api.com/anime/search?q=" + name, false);
	xhr.send();
	if(xhr.status === 200) {
		res = JSON.parse(xhr.responseText);
	}
	return res;
}

var set = function(info) {
	var des;
	if(typeof info === 'undefined' && info === null) {
		console.error(new Error("Info not supplied to set()"));
		return;
	}
	for(var i in info) {
		if( info[i].title === $('div.hero-unit h1')[0].textContent ) {
			des = info[i].synopsis;
			id = info[i].id;
			break;
		}
	}
	$('div.hero-unit p.description')[0].innerHTML = des + '  <a href="http://myanimelist.net/anime.php?id='+ id + '">[MORE]</a>' || "";
}

$(document).ready(function() {
	set(get($('div.hero-unit h1')[0].textContent));
});