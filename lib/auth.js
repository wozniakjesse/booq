module.exports = function(passport, Strategy, bcrypt, db) {
    // TODO: create a config file or something for these passport commands
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        db.query("SELECT * FROM `users` WHERE `id` = ?", id, function(err, rows) {
            done(err, rows[0]);
        });
    });
    
    passport.use(new Strategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(username, password, done) {
            db.query("SELECT * FROM `users` WHERE `email` = ?", username, function(err, rows) {
                if (err)
                    return done(err);
                    
                if (!rows.length)
                    return done(null, false, {message: 'Invalid credentials.'});
                    
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, {message: 'Invalid password'});

                return done(null, rows[0]);
            });
        }
    ));
    
	const loggedIn = function(req, res, next) {
        next()
	    // if (req.user) {
	    //     next();
	    // } else {
	    //     res.redirect('/login');
	    // }
	}
    
    return {
        loggedIn: loggedIn
    }
}