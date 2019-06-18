let mongoose = require('mongoose');
let db;

module.exports = function () {
    if (!db){
        db = mongoose.connect('mongodb://localhost/db_web1');
        mongoose.Promise = global.Promise;
    }
    return db;
};