module.exports = function(app, auth, Classes, strings) {
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
};