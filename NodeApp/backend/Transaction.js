var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var transactionSchema = new Schema({
  patronUsername: { type: String, required: true },
  policymakerUsername: { type: String, required: true },
  amount: { type: Number, required: true },
  behavior: { type: String, required: true },
  day: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: String, required: true },
});

// export personSchema as a class called Person
module.exports = mongoose.model('Transaction', transactionSchema);

transactionSchema.methods.standardizeUsername = function() {
  this.username = this.username.toLowerCase();
  return this.username;
};
