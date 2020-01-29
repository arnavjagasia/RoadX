var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var topicSchema = new Schema({
	title: {type: String, required: true},
    subtitle: {type: String, required: true},
    description: {type: String, required: true} 
    });

// export personSchema as a class called Person
module.exports = mongoose.model('Topic', topicSchema);
