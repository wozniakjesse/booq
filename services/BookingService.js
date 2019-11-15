module.exports = function(){
    var express = require('express');
    var router = express.Router();
   

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

   


    return{
        getCats: getCats,
        getClasses: getClasses,
        getRooms: getRooms,
        insertBooking: insertBooking
    }

}();