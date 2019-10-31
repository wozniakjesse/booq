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
const Cats = require('./services/CatService')(db);

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

// GUEST ACCOUNT
app.get('/guest-account', function(req, res) {
    const context = {
        title: strings.getPageTitle('Guest Account')
    }
    res.type('text/html');
    res.status(200).render('guest-account',  context);
});

app.post('/guest-account',  function(req, res) {
    
    var parameters = [];
    bcrypt.hash(req.body['password'], 10, function(err, hash) {
    
    parameters.push(req.body['email']);
    parameters.push(hash);
    parameters.push(req.body['first_name']);
    parameters.push(req.body['last_name']);
    parameters.push(req.body['vibe']);
    console.log(parameters);
    

    db.query("INSERT INTO users (`email`, `password`, `first_name`, `last_name`, `vibe`)" 
    + "VALUES (?,?,?,?,?)", 
    parameters, function(err, result, fields){
        if(err) 
            {throw err;}
    })
    res.redirect('/');
    })
})


//GUEST BOOKING
app.get('/guest-booking', auth.loggedIn, function(req, res) {
    const context = {
        title: strings.getPageTitle('Guest Booking')
    }
    res.type('text/html');
    res.status(200).render('guest-booking',  context);
});

app.post('/guest-booking', auth.loggedIn, function(req, res, next){
    
    var parameters = [];
    parameters.push(req.body['user_id']);
    parameters.push(req.body['room_id']);
    parameters.push(req.body['cat_id']);
    parameters.push(req.body['date_in']);
    parameters.push(req.body['date_out']);
    parameters.push(req.body['hot_dogs']);
    parameters.push(req.body['pancakes']);
    console.log(parameters);

    db.query("INSERT INTO bookings (`user_id`, `room_id`, `cat_id`, `date_in`, `date_out`, `hot_dogs`, `pancakes`)"
     + "VALUES (?,?,?,?,?,?,?)", 
    parameters, function(err, result, fields){
        if(err) 
            {throw err;}
    })
    res.redirect('/');
    
})

//GUEST OVERVIEW
//rooms
app.get('/guest-rooms-browse', auth.loggedIn, function(req,res,next){
    res.render('guest-rooms-browse');
})

app.get('/guest-rooms-all', auth.loggedIn, function(req,res,next){
    db.query('SELECT '
            +'id as room_id, '
            +'name as room_name, '
            +'description as room_description '
            +'FROM rooms; ', (error, results, fields) =>{
    
    res.render('guest-rooms-all', {data: results});
        })
    })

app.get('/guest-rooms-search', auth.loggedIn, function(req,res,next){
    db.query('SELECT '
            +'id as room_id, '
            +'name as room_name, '
            +'description as room_description '
            +'FROM rooms '
            +'WHERE description LIKE \'%' + req.query['userinput'] + '%\'', (error, results, fields) =>{
    
    res.render('guest-rooms-search', {data: results});
        })
})

//classes
app.get('/guest-classes-browse', auth.loggedIn, function(req,res,next){
    res.render('guest-classes-browse');
})

app.get('/guest-classes-all', auth.loggedIn, function(req,res,next){
    db.query('SELECT '
            +'id as class_id, '
            +'name as class_name, '
            +'description as class_description '
            +'FROM dance_classes; ', (error, results, fields) =>{
    
    res.render('guest-classes-all', {data: results});
        })
    })

app.get('/guest-classes-search', auth.loggedIn, function(req,res,next){
    db.query('SELECT '
            +'id as class_id, '
            +'name as class_name, '
            +'description as class_description '
            +'FROM dance_classes '
            +'WHERE description LIKE \'%' + req.query['userinput'] + '%\'', (error, results, fields) =>{
    
    res.render('guest-classes-search', {data: results});
        })
})

//cats
app.get('/guest-cats-browse', auth.loggedIn, function(req,res,next){
    res.render('guest-cats-browse');
})

app.get('/guest-cats-all', auth.loggedIn, function(req,res,next){
    db.query('SELECT '
            +'id as cat_id, '
            +'name as cat_name, '
            +'vibe as cat_vibe '
            +'FROM cats; ', (error, results, fields) =>{
    
    res.render('guest-cats-all', {data: results});
        })
    })

app.get('/guest-cats-search', auth.loggedIn, function(req,res,next){
    db.query('SELECT '
            +'id as cat_id, '
            +'name as cat_name, '
            +'vibe as cat_vibe '
            +'FROM cats '
            +'WHERE vibe LIKE \'%' + req.query['userinput'] + '%\'', (error, results, fields) =>{
    
    res.render('guest-cats-search', {data: results});
        })
})

app.get('/admin/cats', auth.loggedIn, function(req, res) {
    Cats.getAll().then(function(cats) {
        const context = {
            cats: cats,
            title: strings.getPageTitle('Cats')
        };
        res.status(200).render('admin/cats', context);
    }).catch(function(err) {
        res.type('text/plain');
        res.status(400).send(err);
    });
});

app.get('/admin/cats/add', auth.loggedIn, function(req, res) {
    const context = {
        title: strings.getPageTitle('Add Cat')
    }
    res.status(200).render('admin/addcat', context);
});

app.post('/admin/cats/add', auth.loggedIn, function(req, res) {
    if (!req.body.name) {
        res.type('text/plain');
        res.status(400).send('Error: a cat must have a name property');
    } else {
        delete req.body.submit;
        Cats.add(req.body).then(function(results) {
            res.redirect('/admin/cats');
        }).catch(function(err) {
            res.type('text/plain');
            res.status(400).send(err);
        });
    }
});

app.get('/admin/cats/delete/:id', auth.loggedIn, function(req, res) {
    if (!req.params.id) {
        res.type('text/plain');
        res.status(400).send('Error: missing cat id');
    } else {
        const id = parseInt(req.params.id);
        Cats.remove(id).then(function(results) {
            res.redirect('/admin/cats');
        }).catch(function(err) {
            res.type('text/plain');
            res.status(400).send(err);
        });
    }
});

app.get('/admin/cats/edit/:id', auth.loggedIn, function(req, res) {
    if (!req.params.id) {
        res.type('text/plain');
        res.status(400).send('Error: missing cat id');
    } else {
        const id = parseInt(req.params.id);
        Cats.get(id).then(function(cat) {
            const context = {
                id: cat.id,
                name: cat.name,
                vibe: cat.vibe,
                title: strings.getPageTitle('Cats')
            };
            res.status(200).render('admin/editcat', context);
        }).catch(function(err) {
            res.type('text/plain');
            res.status(400).send(err);
        });
    }
});

app.post('/admin/cats/edit/:id', auth.loggedIn, function(req, res) {
    if (!req.params.id || !req.body.name) {
        res.type('text/plain');
        res.status(400).send('Error: a cat must have id and name properties');
    } else {
        delete req.body.submit;
        const cat = {
            id: parseInt(req.params.id),
            name: req.body.name,
            vibe: req.body.vibe
        }
        Cats.edit(cat).then(function(results) {
            res.redirect('/admin/cats');
        }).catch(function(err) {
            res.type('text/plain');
            res.status(400).send(err);
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