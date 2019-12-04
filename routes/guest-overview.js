module.exports = function(app, db, strings) {
    //GUEST OVERVIEW
    //rooms
    app.get('/guest/guest-rooms-browse', function(req,res,next){
        res.render('guest/guest-rooms-browse');
    })

    app.get('/guest/guest-rooms-all', function(req,res,next){
        db.query('SELECT '
                +'id as room_id, '
                +'name as room_name, '
                +'description as room_description '
                +'FROM rooms; ', (error, results, fields) =>{
        
        res.render('guest/guest-rooms-all', {data: results});
            })
        })

    app.get('/guest/guest-rooms-search', function(req,res,next){
        db.query('SELECT '
                +'id as room_id, '
                +'name as room_name, '
                +'description as room_description '
                +'FROM rooms '
                +'WHERE description LIKE \'%' + req.query['userinput'] + '%\'', (error, results, fields) =>{
        
        res.render('guest/guest-rooms-search', {data: results});
            })
    })

    //classes
    app.get('/guest/guest-classes-browse', function(req,res,next){
        res.render('guest/guest-classes-browse');
    })

    app.get('/guest/guest-classes-all', function(req,res,next){
        db.query('SELECT '
                +'id as class_id, '
                +'name as class_name, '
                +'description as class_description '
                +'FROM dance_classes; ', (error, results, fields) =>{
        
        res.render('guest/guest-classes-all', {data: results});
            })
        })

    app.get('/guest/guest-classes-search', function(req,res,next){
        db.query('SELECT '
                +'id as class_id, '
                +'name as class_name, '
                +'description as class_description '
                +'FROM dance_classes '
                +'WHERE description LIKE \'%' + req.query['userinput'] + '%\'', (error, results, fields) =>{
        
        res.render('guest/guest-classes-search', {data: results});
            })
    })

    //cats
    app.get('/guest/guest-cats-browse',  function(req,res,next){
        res.render('guest/guest-cats-browse');
    })

    app.get('/guest/guest-cats-all', function(req,res,next){
        db.query('SELECT '
                +'id as cat_id, '
                +'name as cat_name, '
                +'vibe as cat_vibe '
                +'FROM cats; ', (error, results, fields) =>{
        
        res.render('guest/guest-cats-all', {data: results});
            })
        })

    app.get('/guest/guest-cats-search', function(req,res,next){
        db.query('SELECT '
                +'id as cat_id, '
                +'name as cat_name, '
                +'vibe as cat_vibe '
                +'FROM cats '
                +'WHERE vibe LIKE \'%' + req.query['userinput'] + '%\'', (error, results, fields) =>{
        
        res.render('guest/guest-cats-search', {data: results});
            })
    })
}