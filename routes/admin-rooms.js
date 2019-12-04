module.exports = function(app, auth, Rooms, strings) {
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
};