const express = require('express');
const app = express();
const handlebars = require('express-handlebars').create({defaultLayout: 'main'});
const bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8652);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// serve files in the assets folder
app.use('/assets', express.static(__dirname + '/assets'));


app.get('/', function(req, res) {
    res.type('text/plain');
    res.status(200).send('Serving Booq');
});

app.use(function(req, res) {
    res.type('text/plain');
    res.status(404).send('404 not found');
});

app.use(function(req, res) {
    res.type('text/plain');
    res.status(500).send('500 error');
});

app.listen(app.get('port'), function() {
    console.log ("listening on " + app.get('port'));
});