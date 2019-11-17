module.exports = function(db) {
    const get = function(id) {
        return new Promise(function(resolve, reject) {
            db.query('SELECT `id`, `name`, `description` FROM `dance_classes` WHERE `id` = ?;', id, function(err, dance_class) {
                if (err)
                    reject(err);
                resolve(dance_class[0]);
            });
        });
    }
    
    const getAll = function() {
        return new Promise(function(resolve, reject) {
            db.query('SELECT `id`, `name`, `description` FROM `dance_classes`;', function(err, danceClasses) {
                if (err)
                    reject(err);
                resolve(danceClasses);
            });
        });
    }
    
    const add = function(dance_class) {
        return new Promise(function(resolve, reject) {
            db.query('INSERT INTO `dance_classes` SET ?', dance_class, function(err, results, fields) {
                if (err)
                    reject(err);
                resolve(results);
            });
        });
    }
    
    const edit = function(dance_class) {
        const id = dance_class.id;
        delete dance_class.id;
        return new Promise(function(resolve, reject) {
            db.query('UPDATE `dance_classes` SET ? WHERE `id` = ?', [dance_class, id], function(err, results, fields) {
                if (err)
                    reject(err);
                resolve(results);
            });
        });
    }
    
    const remove = function(id) {
        return new Promise(function(resolve, reject) {
            db.query('DELETE FROM `dance_classes` WHERE `id` = ?', id, function(err, results, fields) {
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