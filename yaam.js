/*
 * YAAM Database Parser
 * Thanks, HarHar!
 *
 * Format:
 * First line is YAAM;Databasename
 * Then: Name;Genre;Status;LastEpisodeWatched;Observations;null;MAL anime ID
 *
 * read(filename, callback): Reads filename, then returns the callback, with the array of data
 * parse(data, callback): Parses the array from YAAM.read. If a callback is supplied, then it will return the callback with the object, otherwise it will return the object
 * 
 * Test case: 
 *	var yaam = require('./yaam');
 * 	yaam.read('databoose', function(rdata) {
 *		yaam.parse(rdata, function(pdata) {
 *			console.log(pdata);
 *		});
 *	});
 *
 */

var fs = require('fs');

module.exports = {
	read: function(filename, callback) {
		var retarr = [];
		if(typeof filename === 'undefined' && filename === null) {
			console.error(new Error("YAAM.read not supplied with filename"));
			return null;
		}
		fs.readFile(filename, function(err, data) {
			var ndata;
			data = data.toString('utf8').split("\n");
			data.splice(-1, 1); // XXX Not sure if this will always remove the "" property, but so far hasn't fucked up. Need more tests.
			return callback(data);
		});
	},
	parse: function(data, callback) {
		var templine, retobject = {};
		if(typeof data === 'undefined' && data === null) {
			console.error(new Error("YAAM.parse not supplied with data"));
			return null;
		}
		for(var i = 0; i < data.length; i++) {
			templine = data[i].split(";");
			if(i == 0) {
				if(templine[0] !== 'YAAM') {
					console.error(new Error("YAAM.parse not supplied correctly formatted database"));
					return null;					
				}
				retobject["DBNAME"] = templine[1];
				continue;
			}
			retobject[templine[0]] = {
				genre: templine[1],
				status: ( templine[2] === "W" ? "Watched" : ( templine[2] === "Q" ? "On queue" : ( templine[2] === "H" ? "On hold" : ( templine[2] === "N" ? "Not watching" : ( templine[2] === "C" ? "Current" : "Invalid"))))), // Oh god...
				episode: Number(templine[3]),
				observations: ( templine[4] === 'null' ? null : templine[4] ),
				image: ( templine[5] === 'null' ? null : templine[5] ),
				mal: ( typeof templine[6] === 'undefined' ? null : templine[6] )
			}
		}
		if(typeof callback === 'undefined' && callback === null) {
			return retobject;
		} else if(typeof callback === 'function' && callback !== null) {
			return callback(retobject);
		}
	}
};
