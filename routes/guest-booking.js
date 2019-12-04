module.exports = function(app, auth, db, BookingService, strings) {
    //GUEST BOOKING
    app.get('/guest/guest-booking', auth.loggedIn, function(req, res){
        var context = {};
        var db = req.app.get('db');


        Promise.all([
            BookingService.getRooms(res, db, context), 
            BookingService.getCats(res, db, context),
            BookingService.getClasses(res, db, context)]).then(function(values){
                context = {
                rooms : values[0],
                cats : values[1],
                classes : values[2]
                }
                res.render('guest/guest-booking', context);
            })
                
    })



    app.post('/guest/guest-booking', auth.loggedIn, function(req, res){
        var db = req.app.get('db');
        context ={}
        BookingService.insertBooking(res, req, db)
        
    })
}