var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var patronSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  patronUsername: { type: String, required: true },
  email: { type: String, required: true },
  affiliation: { type: String, required: true },
  totalDonations: { type: Number, required: true },
  rule: { type: String, required: true },
});

// export personSchema as a class called Person
module.exports = mongoose.model('Patron', patronSchema);

patronSchema.methods.standardizeUsername = function() {
  this.username = this.username.toLowerCase();
  return this.username;
};
