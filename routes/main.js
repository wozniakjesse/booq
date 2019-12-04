module.exports = function(app, strings, passport, auth) {

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

    app.get('/links', function(req, res) {
        const context = {
            title: strings.getPageTitle('Links')
        };
        res.status(200).render('links', context);
    });

    app.get('/login', function(req, res) {
        const context = {
            title: strings.getPageTitle('Login')
        }
        res.type('text/html');
        res.status(200).render('login',  context);
    });

    app.post('/login', passport.authenticate('local', { successRedirect: '/guest/guest-booking',
    													failureRedirect: '/login',
    													failureFlash: false }));
                                                        
    app.get('/login-test', auth.loggedIn, function(req, res) {
        res.type('text/plain');
        res.status(200).send('Congrats! You can only see this if you\'re logged in');
    });
};