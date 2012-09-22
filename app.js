var express = require('express'),
    app     = express(),
    fs      = require('fs'),
    stache  = require('stache'),
    args    = process.argv,
    YAAM    = require('./yaam').YAAM;

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'mu');
  app.register('.mu', stache);
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use('/assets', express.static(__dirname + '/static'));
});

app.get('/*', function(req, res) {
	res.write('Install Gentoo');
	res.end();
});