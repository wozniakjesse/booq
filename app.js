const express = require('express');
const app = express();
const handlebars = require('express-handlebars').create({defaultLayout: 'main'});
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./lib/connection');
const auth = require('./lib/auth')(passport, Strategy, bcrypt, db);
const strings = require('./lib/strings');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8652);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// setup sessions
app.use(cookieParser());
app.use(session({
    secret: 'someSuperSecretSalt',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

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
        title: strings.getPageTitle('Home')
    };
    res.type('text/html');
    res.status(200).render('home', context);
});

app.get('/rooms', function(req, res) {
    const context = {
        title: strings.getPageTitle('Tha Rooms')
    };
    res.type('text/html');
    res.status(200).render('rooms', context);
});

app.get('/food', function(req, res) {
    const context = {
        title: strings.getPageTitle('Tha Food')
    };
    res.type('text/html');
    res.status(200).render('food', context);
});

app.get('/fun', function(req, res) {
    const context = {
        title: strings.getPageTitle('Tha Fun')
    };
    res.type('text/html');
    res.status(200).render('fun', context);
});

app.get('/contact', function(req, res) {
    const context = {
        title: strings.getPageTitle('Contact')
    };
    res.type('text/html');
    res.status(200).render('contact', context);
});

app.get('/login', function(req, res) {
    const context = {
        title: strings.getPageTitle('Login')
    }
    res.type('text/html');
    res.status(200).render('login',  context);
});

app.post('/login', passport.authenticate('local', { successRedirect: '/',
													failureRedirect: '/login',
													failureFlash: false }));
                                                    
app.get('/login-test', auth.loggedIn, function(req, res) {
    res.type('text/plain');
    res.status(200).send('Congrats! You can only see this if you\'re logged in');
});

app.get('/hasher', function(req, res) {
    if (!req.query.hasOwnProperty('string')) {
        res.type('text/plain');
        res.status(200).send('Add a query parameter of "?string=ABC" where ABC is the password you want a hash for');
    } else {
        bcrypt.hash(req.query.string, 10, function(err, hash) {
            res.type('text/plain');
            res.status(200).send('Your hash is: '+hash);
        });    
    }
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