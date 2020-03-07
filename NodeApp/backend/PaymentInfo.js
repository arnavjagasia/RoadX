var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var paymentInfoSchema = new Schema({
	name: {type: String, required: true},
    expirationdate: {type: String, required: true}, 
    cardnumber: {type: Number, required: true},
    cvv: {type: Number, requred: true}
    });

// export personSchema as a class called Person
module.exports = mongoose.model('PaymentInfo', paymentInfoSchema);
