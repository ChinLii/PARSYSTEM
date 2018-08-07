var mongoose = require('mongoose');

var history = mongoose.Schema({
    name : String,
    activitiesList : [String],
    timestamp : [Number],
    xAxis : [Number],
    yAxis : [Number],
    zAxis : [Number],
})
module.exports = mongoose.model('history',history);