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
													failureRedirect: '/guest/guest-account',
													failureFlash: false }));
                                                    
app.get('/login-test', auth.loggedIn, function(req, res) {
    res.type('text/plain');
    res.status(200).send('Congrats! You can only see this if you\'re logged in');
});




// GUEST ACCOUNT
app.get('/guest/guest-account', function(req, res) {
    const context = {
        title: strings.getPageTitle('Guest Account')
    }
    res.type('text/html');
    res.status(200).render('guest/guest-account',  context);

});

app.post('/guest/guest-account', function(req, res) {
    
    var parameters = [];
    bcrypt.hash(req.body['password'], 10, function(err, hash) {
    
    parameters.push(req.body['email']);
    parameters.push(hash);
    parameters.push(req.body['first_name']);
    parameters.push(req.body['last_name']);
    parameters.push(req.body['vibe']);
    

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
app.get('/guest/guest-booking', auth.loggedIn, function(req, res){
    var callbackCount = 0;
    var context = {};
    var db = req.app.get('db');
    BookingService.getRooms(res, db, context, complete);
    BookingService.getCats(res, db, context, complete);
    BookingService.getClasses(res, db, context, complete)
    function complete(){
        callbackCount++;
        if(callbackCount >= 3){
            res.render('guest/guest-booking', context);
        }
    
    }
});


app.post('/guest/guest-booking', auth.loggedIn, function(req, res){
    var db = req.app.get('db');
    context ={}
    callbackCount = 0;
    BookingService.insertBooking(res, req, db, complete)
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){

        }
    }
})



//GUEST OVERVIEW
//rooms
app.get('/guest/guest-rooms-browse', function(req,res,next){
    res.render('guest/guest-rooms-browse');
})

app.get('/guest/guest-rooms-all', function(req,res,next){
    db.query('SELECT '
            +'id as room_id, '
            +'name as room_name, '
            +'description as room_description '
            +'FROM rooms; ', (error, results, fields) =>{
    
    res.render('guest/guest-rooms-all', {data: results});
        })
    })

app.get('/guest/guest-rooms-search', function(req,res,next){
    db.query('SELECT '
            +'id as room_id, '
            +'name as room_name, '
            +'description as room_description '
            +'FROM rooms '
            +'WHERE description LIKE \'%' + req.query['userinput'] + '%\'', (error, results, fields) =>{
    
    res.render('guest/guest-rooms-search', {data: results});
        })
})

//classes
app.get('/guest/guest-classes-browse', function(req,res,next){
    res.render('guest/guest-classes-browse');
})

app.get('/guest/guest-classes-all', function(req,res,next){
    db.query('SELECT '
            +'id as class_id, '
            +'name as class_name, '
            +'description as class_description '
            +'FROM dance_classes; ', (error, results, fields) =>{
    
    res.render('guest/guest-classes-all', {data: results});
        })
    })

app.get('/guest/guest-classes-search', function(req,res,next){
    db.query('SELECT '
            +'id as class_id, '
            +'name as class_name, '
            +'description as class_description '
            +'FROM dance_classes '
            +'WHERE description LIKE \'%' + req.query['userinput'] + '%\'', (error, results, fields) =>{
    
    res.render('guest/guest-classes-search', {data: results});
        })
})

//cats
app.get('/guest/guest-cats-browse',  function(req,res,next){
    res.render('guest/guest-cats-browse');
})

app.get('/guest/guest-cats-all', function(req,res,next){
    db.query('SELECT '
            +'id as cat_id, '
            +'name as cat_name, '
            +'vibe as cat_vibe '
            +'FROM cats; ', (error, results, fields) =>{
    
    res.render('guest/guest-cats-all', {data: results});
        })
    })

app.get('/guest/guest-cats-search', function(req,res,next){
    db.query('SELECT '
            +'id as cat_id, '
            +'name as cat_name, '
            +'vibe as cat_vibe '
            +'FROM cats '
            +'WHERE vibe LIKE \'%' + req.query['userinput'] + '%\'', (error, results, fields) =>{
    
    res.render('guest/guest-cats-search', {data: results});
        })
})


//ADMIN CATS
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

/*
*   Admin Rooms - View All
*/
app.get('/admin/rooms', auth.loggedIn, function(req, res) {
    Rooms.getAll().then(function(rooms) {
        const context = {
            rooms: rooms,
            title: strings.getPageTitle('Rooms')
        };
        res.status(200).render('admin/rooms', context);
    }).catch(function(err) {
        res.type('text/plain');
        res.status(400).send(err);
    });
});

/*
*   Admin Rooms - Add Form
*/
app.get('/admin/rooms/add', auth.loggedIn, function(req, res) {
    const context = {
        title: strings.getPageTitle('Add Room')
    }
    res.status(200).render('admin/addroom', context);
});

/*
*   Admin Rooms - Add API Endpoint
*/
app.post('/admin/rooms/add', auth.loggedIn, function(req, res) {
    if (!req.body.name) {
        res.type('text/plain');
        res.status(400).send('Error: a room must have a name property');
    } else {
        delete req.body.submit;
        Rooms.add(req.body).then(function(results) {
            res.redirect('/admin/rooms');
        }).catch(function(err) {
            res.type('text/plain');
            res.status(400).send(err);
        });
    }
});

/*
*   Admin Rooms - Edit Form
*/
app.get('/admin/rooms/edit/:id', auth.loggedIn, function(req, res) {
    if (!req.params.id) {
        res.type('text/plain');
        res.status(400).send('Error: missing room id');
    } else {
        const id = parseInt(req.params.id);
        Rooms.get(id).then(function(room) {
            const context = {
                id: room.id,
                name: room.name,
                description: room.description,
                title: strings.getPageTitle('Edit Room')
            };
            res.status(200).render('admin/editroom', context);
        }).catch(function(err) {
            res.type('text/plain');
            res.status(400).send(err);
        });
    }
});

/*
*   Admin Rooms - Edit Room API Endpoint
*/
app.post('/admin/rooms/edit/:id', auth.loggedIn, function(req, res) {
    if (!req.params.id || !req.body.name) {
        res.type('text/plain');
        res.status(400).send('Error: a room must have id and name properties');
    } else {
        delete req.body.submit;
        const room = {
            id: parseInt(req.params.id),
            name: req.body.name,
            description: req.body.description
        }
        Rooms.edit(room).then(function(results) {
            res.redirect('/admin/rooms');
        }).catch(function(err) {
            res.type('text/plain');
            res.status(400).send(err);
        });
    }
});

/*
*   Admin Rooms - Delete
*/
app.get('/admin/rooms/delete/:id', auth.loggedIn, function(req, res) {
    if (!req.params.id) {
        res.type('text/plain');
        res.status(400).send('Error: missing room id');
    } else {
        const id = parseInt(req.params.id);
        Rooms.remove(id).then(function(results) {
            res.redirect('/admin/rooms');
        }).catch(function(err) {
            res.type('text/plain');
            res.status(400).send(err);
        });
    }
});

/*
*   Admin Classes - View All
*/
app.get('/admin/classes', auth.loggedIn, function(req, res) {
    Classes.getAll().then(function(classes) {
        const context = {
            classes: classes,
            title: strings.getPageTitle('Dance Classes')
        };
        res.status(200).render('admin/classes', context);
    }).catch(function(err) {
        res.type('text/plain');
        res.status(400).send(err);
    });
});

/*
*   Admin Classes - Add Form
*/
app.get('/admin/classes/add', auth.loggedIn, function(req, res) {
    const context = {
        title: strings.getPageTitle('Add Dance Class')
    }
    res.status(200).render('admin/addclass', context);
});

/*
*   Admin Classes - Add API Endpoint
*/
app.post('/admin/classes/add', auth.loggedIn, function(req, res) {
    if (!req.body.name) {
        res.type('text/plain');
        res.status(400).send('Error: a dance class must have a name property');
    } else {
        delete req.body.submit;
        Classes.add(req.body).then(function(results) {
            res.redirect('/admin/classes');
        }).catch(function(err) {
            res.type('text/plain');
            res.status(400).send(err);
        });
    }
});

/*
*   Admin Classes - Edit Form
*/
app.get('/admin/classes/edit/:id', auth.loggedIn, function(req, res) {
    if (!req.params.id) {
        res.type('text/plain');
        res.status(400).send('Error: missing dance class id');
    } else {
        const id = parseInt(req.params.id);
        Classes.get(id).then(function(danceClass) {
            const context = {
                id: danceClass.id,
                name: danceClass.name,
                description: danceClass.description,
                title: strings.getPageTitle('Edit Dance Class')
            };
            res.status(200).render('admin/editclass', context);
        }).catch(function(err) {
            res.type('text/plain');
            res.status(400).send(err);
        });
    }
});

/*
*   Admin Classes - Edit Room API Endpoint
*/
app.post('/admin/classes/edit/:id', auth.loggedIn, function(req, res) {
    if (!req.params.id || !req.body.name) {
        res.type('text/plain');
        res.status(400).send('Error: a dance class must have id and name properties');
    } else {
        delete req.body.submit;
        const danceClass = {
            id: parseInt(req.params.id),
            name: req.body.name,
            description: req.body.description
        }
        Classes.edit(danceClass).then(function(results) {
            res.redirect('/admin/classes');
        }).catch(function(err) {
            res.type('text/plain');
            res.status(400).send(err);
        });
    }
});

/*
*   Admin Classes - Delete
*/
app.get('/admin/classes/delete/:id', auth.loggedIn, function(req, res) {
    if (!req.params.id) {
        res.type('text/plain');
        res.status(400).send('Error: missing dance class id');
    } else {
        const id = parseInt(req.params.id);
        Classes.remove(id).then(function(results) {
            res.redirect('/admin/classes');
        }).catch(function(err) {
            res.type('text/plain');
            res.status(400).send(err);
        });
    }
});

/*
*   Admin Overview
*/
app.get('/admin', auth.loggedIn, function(req, res) {
    res.redirect('/admin/overview');
});
app.get('/admin/overview', auth.loggedIn, function(req, res) {
    const start = moment().startOf('week');
    const end = moment().endOf('week');
    BookingService.getWeeklyBookings(start, end).then(function(bookings) {
        const context = {
            title: strings.getPageTitle('Admin Overview'),
            bookings: bookings,
            start: start.format('MMMM D'),
            end: end.format('MMMM D')
        };
        res.status(200).render('admin/overview', context);
    }).catch(function(err) {
        res.type('text/plain');
        res.status(400).send(err);
    });
});

/*
*   Admin User List
*/
app.get('/admin/userlist', auth.loggedIn, function(req, res) {
    Users.getAll().then(function(users) {
        const context = {
            title: strings.getPageTitle('Admin User List'),
            users: users
        };
        res.status(200).render('admin/users', context);
    }).catch(function(err) {
        res.type('text/plain');
        res.status(400).send(err);
    });
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