var express = require('express'),
     app     = express(),
    fs      = require('fs'),
    args    = process.argv,
    YAAM    = require('./yaam');


if( args.indexOf('-d') === -1 || (typeof args[args.indexOf('-d') + 1] === 'undefined' || args[args.indexOf('-d') + 1] === (null || undefined)) ) {
	console.error(new Error("Database must be supplied (`-d database-file`)"));
	process.exit(1);
}

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('ejs', require('ejs').renderFile);
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use('/assets', express.static(__dirname + '/assets'));
});

// Front page
app.get('/', function(req, res) {
	var filename = ( args.indexOf('-d') !== -1 ? args[args.indexOf('-d') + 1] : null ),
	dbname, dbcount = 0
	YAAM.read(filename, function(rdata) {
		YAAM.parse(rdata, function(pdata) {
			for(var i in pdata) {
				if( i === 'DBNAME' ) {
					dbname = pdata[i];
					continue;
				}
				dbcount++;
			}
			res.render('home', {
				'title': 'Home',
				'dbname': dbname,
				'dbcount': dbcount
			});
		});
	});
	
});

app.get('/view', function(req, res) {
	var filename = ( args.indexOf('-d') !== -1 ? args[args.indexOf('-d') + 1] : null ),
	    list     = [],
	    dbname, info; 
	//var genre, status, episode, observations;
	YAAM.read(filename, function(rdata) {
		YAAM.parse(rdata, function(pdata) {
			for(var i in pdata) {
				if( i === 'DBNAME' ) {
					dbname = pdata[i];
					continue;
				}
				list.push(i);
			}
			res.render('list', {
				'title': 'View',
				'dbname': dbname,
				'list': list
			});
		});
	});
});

// Viewing info about an animu
app.get('/view/:animu', function(req, res) {
	var filename = ( args.indexOf('-d') !== -1 ? args[args.indexOf('-d') + 1] : null ),
	    list     = [],
	    dbname, info; 
	//var genre, status, episode, observations;
	YAAM.read(filename, function(rdata) {
		YAAM.parse(rdata, function(pdata) {
			for(var i in pdata) {
				if( i === 'DBNAME' ) {
					dbname = pdata[i];
					continue;
				}
				if( unescape(req.params.animu) === unescape(i) ) {
					info = {
						genre: pdata[i].genre,
						status: pdata[i].status,
						episode: pdata[i].episode,
						observations: pdata[i].observations,
						image: pdata[i].image,
						mal: pdata[i].mal
					};
				}
				list.push(i);
			}
			res.render('view', {
				'title': 'View',
				'dbname': dbname,
				'list': list,
				'selected': ( req.params.animu || null ),
				'info': info
			});
		});
	});
});

// Add an anime page
app.get('/add', function(req, res) {
	res.render('manage', {
		'title': 'Add entry',
		'mode': 'add'
	});
});

// Post requests
app.post('/post', function(req, res) {
	var file = req.files.image,
	    name = req.body.name,
	    status = req.body.status.charAt(0).toUpperCase(),
	    episode = req.body.episode,
	    observations = req.body.observations;
	
});

// 404 page
app.get('/*', function(req, res) {
	res.status(404).render('404', {
		'title': '404!'
	});
});

app.listen(8190);