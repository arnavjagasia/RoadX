var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var messageSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  username: { type: String, required: true },
  topics: [{ type: String } ],
  name: { type: String, required: true }
});

// export personSchema as a class called Person
module.exports = mongoose.model('Message', messageSchema);

messageSchema.methods.standardizeUsername = function() {
  this.username = this.username.toLowerCase();
  return this.username;
};
