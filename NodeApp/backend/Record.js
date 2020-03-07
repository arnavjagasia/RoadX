var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var recordSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  topic: { type: String, required: true },
  //usernames of politicians who voted yes
  votedYes: [{
    type: String
}],
//usernames of politicians who voted no
votedNo: [{
    type: String
}]
});

// export votingRecordSchema as a class called VotingRecord
module.exports = mongoose.model('Record', recordSchema);
