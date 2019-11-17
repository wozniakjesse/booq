module.exports = function(db) {
    const getAll = function() {
        return new Promise(function(resolve, reject) {
            db.query('SELECT id, email, first_name, last_name, vibe FROM users', function(err, users) {
                if (err)
                    reject(err);
                resolve(users);
            });
        });
    }
    
    return {
        getAll: getAll
    }
};