module.exports = function(app, strings, bcrypt, db) {
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
        res.redirect('/login');
        })
    })
};