var express = require('express');
var router = express.Router();

// import the Person class from Person.js
var Person = require('../Person.js');

router.get('/', function(req, res, next) {
    // find all the Person objects in the database
	Person.find( {}, (err, persons) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
		    if (persons.length == 0) {
			res.type('html').status(200);
			res.write('There are no people');
			res.end();
			return;
		    }
		    // use EJS to show all the people
		    res.send(persons);

		}
	}).sort({ 'age': 'asc' }); // this sorts them BEFORE rendering the results
});


module.exports = router;
