module.exports = function(db) {
    const get = function(id) {
        return new Promise(function(resolve, reject) {
            db.query('SELECT `id`, `name`, `vibe` FROM `cats` WHERE `id` = ?;', id, function(err, cat) {
                if (err)
                    reject(err);
                resolve(cat[0]);
            });
        });
    }
    
    const getAll = function() {
        return new Promise(function(resolve, reject) {
            db.query('SELECT `id`, `name`, `vibe` FROM `cats`;', function(err, cats) {
                if (err)
                    reject(err);
                resolve(cats);
            });
        });
    }
    
    const add = function(cat) {
        return new Promise(function(resolve, reject) {
            db.query('INSERT INTO `cats` SET ?', cat, function(err, results, fields) {
                if (err)
                    reject(err);
                resolve(results);
            });
        });
    }
    
    const edit = function(cat) {
        const id = cat.id;
        delete cat.id;
        return new Promise(function(resolve, reject) {
            db.query('UPDATE `cats` SET ? WHERE `id` = ?', [cat, id], function(err, results, fields) {
                if (err)
                    reject(err);
                resolve(results);
            });
        });
    }
    
    const remove = function(id) {
        return new Promise(function(resolve, reject) {
            db.query('DELETE FROM `cats` WHERE `id` = ?', id, function(err, results, fields) {
                if (err)
                    reject(err);
                resolve(results);
            });
        });
    }
    
    return {
        get: get,
        getAll: getAll,
        add: add,
        edit: edit,
        remove: remove
    }
};