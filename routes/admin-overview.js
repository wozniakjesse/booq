module.exports = function(app, auth, BookingService, Users, strings, moment) {
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
};