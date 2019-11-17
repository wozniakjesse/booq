module.exports = function(db, moment) {
    function getRooms(res, db, context, complete){
        db.query("SELECT id, name, description FROM rooms", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rooms  = results;
            complete();
        });
    }

    

    function getCats(res, db, context, complete){
        db.query("SELECT id, name, vibe from cats", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.cats = results;
            complete();
        });
    }

    function getClasses(res, db, context, complete){
        db.query("SELECT id, name, description from dance_classes", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.classes = results;
            complete();
        });
    }


    function insertBooking(res, req, db, complete){
        
        var sql = "INSERT INTO bookings (room_id, cat_id, date_in, date_out, "
            + "hot_dogs, pancakes, user_id) VALUES (?,?,?,?,?,?,?) "
        var inserts = [req.body.room_id, req.body.cat_id, req.body.date_in, 
            req.body.date_out, req.body.hot_dogs, req.body.pancakes, req.user.id];
        sql = db.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/');
            }
            console.log(inserts)
            complete();
        })
    }

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
            "GROUP BY b.id;";
            
            db.query(sql, [start.format('YYYY-M-D'), end.format('YYYY-M-D')], function(err, results, fields) {
                if (err)
                    reject(err);
                    
                results = results.map(function(row) {
                    row.date_in = moment(row.date_in).format('YYYY-M-D').toString();
                    row.date_out = moment(row.date_out).format('YYYY-M-D').toString();
                    return row;
                });

                resolve(results);
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