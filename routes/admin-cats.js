module.exports = function(app, auth, Cats, strings) {
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
}