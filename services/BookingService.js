const Booking = require('../models/Booking');

module.exports = function(db, moment) {
    const getRooms = function() {
        return new Promise(function(resolve, reject) {
            db.query('SELECT `id`, `name`, `description` FROM `rooms`;', function(err, rooms) {
                if (err)
                    reject(err);
                resolve(rooms);
            });
        });
    }

    

    const getCats = function() {
        return new Promise(function(resolve, reject) {
            db.query('SELECT `id`, `name`, `vibe` FROM `cats`;', function(err, cats) {
                if (err)
                    reject(err);
                resolve(cats);
            });
        });
    }

    const getClasses = function() {
        return new Promise(function(resolve, reject) {
            db.query('SELECT `id`, `name`, `description` FROM `dance_classes`;', function(err, classes) {
                if (err)
                    reject(err);
                resolve(classes);
            });
        });
    }


    function insertBooking(res, req, db){
        const today = new Date().toJSON().slice(0, 10)
        if ((req.body.date_in < today) || (req.body.date_in > req.body.date_out)){
            context = req.body 
            req.body = {}
            res.render('guest/guest-booking-error')
        }else{


        var classBookings = []
        const classIds = req.body.class_id;
        const catId = req.body.cat_id.length ? req.body.cat_id : null;
        var sql = "INSERT INTO bookings (room_id, cat_id, date_in, date_out, "
            + "hot_dogs, pancakes, user_id) VALUES (?,?,?,?,?,?,?) "
        var inserts = [req.body.room_id, catId, req.body.date_in, 
            req.body.date_out, req.body.hot_dogs, req.body.pancakes, req.user.id];
        sql = db.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                const bookingId = results.insertId;
                if (classIds.length == 1){
                sql = "INSERT INTO class_bookings (booking_id, class_id) VALUES (?)";
                    classBookings.push(bookingId)
                    classBookings.push(parseInt(classIds))
                }else{
                classBookings = classIds.map(function(id) {
                    sql = "INSERT INTO class_bookings (booking_id, class_id) VALUES ?";
                    const arr = [];
                    arr.push(bookingId);
                    arr.push(parseInt(id));
                    return arr;
                });
            }
                db.query(sql, [classBookings], function(error, results, fields) {
                    if(error){
                        res.write(JSON.stringify(error));
                        res.end();
                    } else {
                        res.redirect('/');
                    }
                });
            }
        })
    }}

    // This is O(7n) time - could be improved, but n is small
    const sortWeeklyBookings = function(dates, start, end) {
        const sorted = [];
        
        let it = moment(start); // date iterator
        while (it.isSameOrBefore(end)) {
            const date = {
                date: it.format('dddd MMMM Do'),
                bookings: []
            }
            
            for (booking of dates)
                if (booking.bookedOn(it))
                    date.bookings.push(booking);
                    
            sorted.push(date);
            it.add(1, 'day');
        }
        
        return sorted;
    };
    
    const getWeeklyBookings = function(start, end) {
        return new Promise(function(resolve, reject) {
            let sql = "SELECT b.date_in, b.date_out, b.hot_dogs, b.pancakes, "+
            "r.name as room, "+
            "u.first_name, u.last_name, u.vibe as user_vibe, c.name as cat_name, "+
            "GROUP_CONCAT(DISTINCT dc.name SEPARATOR ', ') as classes "+
            "FROM bookings as b "+
            "INNER JOIN users as u ON b.user_id = u.id "+
            "INNER JOIN rooms as r ON b.room_id = r.id "+
            "LEFT JOIN cats as c ON b.cat_id = c.id "+
            "LEFT JOIN class_bookings as cl ON cl.booking_id = b.id "+
            "LEFT JOIN dance_classes as dc ON cl.class_id = dc.id "+
            "WHERE b.date_in >= ? AND b.date_in <= ? "+
            "GROUP BY b.id "+
            "ORDER BY b.date_in;";
            
            db.query(sql, [start.format('YYYY-M-D'), end.format('YYYY-M-D')], function(err, results, fields) {
                if (err)
                    reject(err);
                    
                results = results.map(function(row) {
                    const b = new Booking(
                        row.date_in,
                        row.date_out,
                        row.room,
                        row.first_name,
                        row.last_name,
                        row.vibe,
                        row.cat_name,
                        row.classes,
                        row.hot_dogs,
                        row.pancakes
                    );
                    return b;
                });

                resolve(sortWeeklyBookings(results, start, end));
            });
        });
    };


    return {
        getCats: getCats,
        getClasses: getClasses,
        getRooms: getRooms,
        insertBooking: insertBooking,
        getWeeklyBookings: getWeeklyBookings
    }

};