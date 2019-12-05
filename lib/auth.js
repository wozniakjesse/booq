module.exports = function(passport, Strategy, bcrypt, db) {
    // TODO: create a config file or something for these passport commands
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        db.query("SELECT * FROM `users` WHERE `id` = ?", id, function(err, rows) {
            if (rows.length <= 0) {
                let msg = 'That user does not exist.'+
                    ' It might have been cleared when the database was reset. '+
                    'Please clear cookies and try the site again.';
                err = new Error(msg);
                done(err, {});
            } else {
                done(err, rows[0]);
            }
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
	    if (req.user) {
	        next();
	    } else {
	        res.redirect('/login');
	    }
	}
    
    return {
        loggedIn: loggedIn
    }
}