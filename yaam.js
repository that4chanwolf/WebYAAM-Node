/*
 * YAAM Database Parser
 * Thanks, HarHar!
 *
 * Format:
 * First line is YAAM;Databasename
 * Then: Name;Genre;Status;Observations;null;MAL anime ID
 *
 * read(filename): Reads filename, then returns the file data in an array
 * parse(data): Parses the array from YAAM.read and returns an object
 * 
 * Test cases: 
 * 	YAAM.parse(["YAAM;Test", "Steins Gate;Sci-Fi;W;null;null;null"]);
 *
 */

exports.YAAM = {
	read: function(filename) {
		if(typeof filename === 'undefined' && filename === null) {
			console.error(new Error("YAAM.read not supplied with filename"));
			return null;
		}
		fs.readFile(filename, 'utf8', function(err, data) {
			if(err || !data) {
				console.error(new Error("YAAM.read failed to read file"));
				return null;
			} else {
				return data.split('\n');
			}
		});
	},
	parse: function(data) {
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
				status: ( templine[2] === "W" ? "Watched" : ( templine[2] === "Q" ? "On Queue" : ( templine[2] === "H" ? "On hold" : ( templine[2] === "N" ? "Not watching" : ( templine[2] === "C" ? "Current" : "Invalid"))))), // Oh god...
				observations: ( templine[3] === 'null' ? null : templine[3] ),
				image: ( templine[4] === 'null' ? null : templine[4] ),
				mal: ( templine[5] === 'null' ? null : templine[5] )
			}
		}
		return retobject;
	}
};
