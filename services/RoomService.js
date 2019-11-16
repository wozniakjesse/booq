module.exports = function(db) {
    const get = function(id) {
        return new Promise(function(resolve, reject) {
            db.query('SELECT `id`, `name`, `description` FROM `rooms` WHERE `id` = ?;', id, function(err, room) {
                if (err)
                    reject(err);
                resolve(room[0]);
            });
        });
    }
    
    const getAll = function() {
        return new Promise(function(resolve, reject) {
            db.query('SELECT `id`, `name`, `description` FROM `rooms`;', function(err, rooms) {
                if (err)
                    reject(err);
                resolve(rooms);
            });
        });
    }
    
    const add = function(room) {
        return new Promise(function(resolve, reject) {
            db.query('INSERT INTO `rooms` SET ?', room, function(err, results, fields) {
                if (err)
                    reject(err);
                resolve(results);
            });
        });
    }
    
    const edit = function(room) {
        const id = room.id;
        delete room.id;
        return new Promise(function(resolve, reject) {
            db.query('UPDATE `rooms` SET ? WHERE `id` = ?', [room, id], function(err, results, fields) {
                if (err)
                    reject(err);
                resolve(results);
            });
        });
    }
    
    const remove = function(id) {
        return new Promise(function(resolve, reject) {
            db.query('DELETE FROM `rooms` WHERE `id` = ?', id, function(err, results, fields) {
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