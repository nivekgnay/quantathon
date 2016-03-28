var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StockSchema   = new Schema({
    name: String,
    price: Number
});

module.exports = mongoose.model('Stock', StockSchema);