var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var policymakerSchema = new Schema({
	firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    birthday: {type: String, required: true},
    phone: {type: String, required: true},
    affiliation: {type: String, required: true},
    blurb: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    totalDonations: {type: Number, default: 0},
    website: {type: String},
    bankAccount: {type: Object, required: false, default: null},
    chosenTopics: [{ type: String }],
    });

// export personSchema as a class called Person
module.exports = mongoose.model('Policymaker', policymakerSchema);

policymakerSchema.methods.standardizeUsername = function() {
    this.username = this.username.toLowerCase();
    return this.username;
}
