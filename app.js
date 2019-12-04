const express = require('express');
const app = express();
const handlebars = require('express-handlebars').create({defaultLayout: 'main'});
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const moment = require('moment');
const db = require('./lib/connection');
const auth = require('./lib/auth')(passport, Strategy, bcrypt, db);
const strings = require('./lib/strings');
const Cats = require('./services/CatService')(db);
const Rooms = require('./services/RoomService')(db);
const Classes = require('./services/DanceClassService')(db);
const BookingService = require('./services/BookingService')(db, moment);
const Users = require('./services/UserService')(db);



app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8652);
app.set('db', db);
app.set('bcrypt', bcrypt);
app.set('auth', auth)

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

// routes
require('./routes/main')(app, strings, passport, auth);
require('./routes/guest-account')(app, strings, bcrypt, db);
require('./routes/guest-booking')(app, auth, db, BookingService, strings);
require('./routes/guest-overview')(app, db, strings);
require('./routes/admin-cats')(app, auth, Cats, strings);
require('./routes/admin-rooms')(app, auth, Rooms, strings);
require('./routes/admin-classes')(app, auth, Classes, strings);
require('./routes/admin-overview')(app, auth, BookingService, Users, strings, moment);


app.use(function(req, res) {
    res.type('text/plain');
    res.status(404).send('404 not found');
});

app.use(function(req, res) {
    res.type('text/plain');
    res.status(500).send('500 error');
});

app.use(function(req, res) {
    res.type('text/plain');
    res.status(409).send('Invalid Dates');
});

app.listen(app.get('port'), function() {
    console.log ("listening on " + app.get('port'));
});