const express = require('express');
const app = express();
const handlebars = require('express-handlebars').create({defaultLayout: 'main'});
const bodyParser = require('body-parser');
const db = require('./lib/connection');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8652);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// serve files in the assets folder
app.use('/assets', express.static(__dirname + '/assets'));

/*
app.get('/test', function(req, res) {
    // this is an example of database use
    db.query('INSERT INTO cats (name, vibe) VALUE ("ricky", "good")', function(error, results, fields) {
        if (error)
            res.status(400).send(error);
            
        res.type('text/plain');
        res.status(200).send({results: results, fields: fields});
    });
});
*/

app.get('/', function(req, res) {
    const context = {
        title: 'Home | Booq Dane\'s Beautiful Bed and Breakfast and Breakdancing Camp'
    };
    res.type('text/html');
    res.status(200).render('home', context);
});

app.get('/rooms', function(req, res) {
    const context = {
        title: 'Tha Rooms | Booq Dane\'s Beautiful Bed and Breakfast and Breakdancing Camp'
    };
    res.type('text/html');
    res.status(200).render('rooms', context);
});

app.get('/food', function(req, res) {
    const context = {
        title: 'Tha Food | Booq Dane\'s Beautiful Bed and Breakfast and Breakdancing Camp'
    };
    res.type('text/html');
    res.status(200).render('food', context);
});

app.get('/fun', function(req, res) {
    const context = {
        title: 'Tha Fun | Booq Dane\'s Beautiful Bed and Breakfast and Breakdancing Camp'
    };
    res.type('text/html');
    res.status(200).render('fun', context);
});

app.get('/contact', function(req, res) {
    const context = {
        title: 'Contact | Booq Dane\'s Beautiful Bed and Breakfast and Breakdancing Camp'
    };
    res.type('text/html');
    res.status(200).render('contact', context);
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