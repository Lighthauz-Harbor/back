/**
 * Created by Baskoro Indrayana on 10/28/2016.
 */
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.get('/', function(req, res) {
    res.send('Hello, world!');
});

var PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function() {
    var host = 'localhost';
    console.log('Server is listening at http://' + host + ':' + PORT);
});
