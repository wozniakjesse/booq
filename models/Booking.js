const moment = require('moment');

/*
*   Booking Model
*   @param  dateIn      a moment date instance
*   @param  dateOut     a moment date instance
*/
module.exports = function(dateIn, dateOut, room, firstName, lastName, vibe, cat, classes, hotDogs, pancakes) {
    this.dateIn = moment(dateIn);
    this.dateOut = moment(dateOut);
    this.room = room;
    this.firstName = firstName;
    this.lastName = lastName;
    this.name = firstName + " " + lastName;
    this.vibe = vibe;
    this.cat = cat;
    this.classes = classes;
    this.hotDogs = hotDogs;
    this.pancakes = pancakes;

    /*
    *   @returns    boolean     
    */
    this.bookedOn = function(date) {
        return this.dateIn.isSameOrBefore(date) && this.dateOut.isSameOrAfter(date);
    }
};