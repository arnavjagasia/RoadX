var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer2');

// import the Person class from Person.js
var Policymaker = require('../Policymaker.js');
var Patron = require('../Patron.js');
var Transaction = require('../Transaction.js');
var Record = require('../Record.js');
var Topic = require('../Topic.js');
var Message = require('../Message.js');

router.post('/create', function(req, res, next) {
  // construct the Person from the form data which is in the request body
  var policymaker = new Policymaker({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthday:
      String(req.body.selectMonth) +
      '/' +
      String(req.body.selectDate) +
      '/' +
      String(req.body.selectYear),
    email: req.body.email,
    phone: req.body.phone,
    affiliation: req.body.affiliation,
    blurb: req.body.blurb,
    username: req.body.username,
    password: req.body.password,
  });

  // save the person to the database
  policymaker.save(err => {
    if (err) {
      res.type('html').status(400);
      res.write('uh oh: ' + err);
      console.log(err);
      res.end();
    } else {
      // send back succesful
      res.type('html').status(200);
      res.json(req.body);
    }
  });
});

router.post('/finduser', function(req, res, next) {
  var searchname = req.body.username;
  // find the policymaker
  Policymaker.findOne({ username: searchname }, (err, policymaker) => {
    if (err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else if (!policymaker) {
      res.type('html').status(400);
      res.write('There are no policymakers with that name');
      res.end();
    } else {
      res.json(policymaker);
    }
  });
});

router.get('/findallpolicymaker', function(req, res, next) {
  // find all of the policymakers
  Policymaker.find((err, policymakers) => {
    if (err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else if (!policymakers) {
      res.type('html').status(400);
      res.write('No records are available at this time.');
      res.end();
    } else {
      res.json(policymakers);
    }
  });
});

router.post('/findallpatron', function(req, res, next) {
  var searchname = req.body.politician;

  // find all of the patron
  Patron.findOne({ politician: searchname }, (err, patron) => {
    if (err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else if (!patron) {
      res.type('html').status(400);
      res.write('There are no patrons that have donated to this policymaker');
      res.end();
    } else {
      res.json(patron);
    }
  });
});

router.post('/add-bank-account', function(req, res, next) {
  var searchname = req.body.username;
  // find the policymaker
  Policymaker.findOne({ username: searchname }, (err, policymaker) => {
    if (err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else if (!policymaker) {
      res.type('html').status(400);
      res.write('There are no policymakers with that name');
      res.end();
    } else {
      if (req.body.accountName == '' || req.body.accountNumber == '' || req.body.sortCode == '') {
        policymaker.bankAccount = null;
      } else {
        policymaker.bankAccount = {
          accountName: req.body.accountName,
          accountNumber: req.body.accountNumber,
          sortCode: req.body.sortCode,
        };
      }
      policymaker.save(err => {
        if (err) {
          res.type('html').status(400);
          res.write('uh oh: ' + err);
          console.log(err);
          res.end();
        } else {
          // send back successful
          res.type('html').status(200);
          res.json(req.body);
        }
      });
    }
  });
});

router.post('/getTransactions', function(req, res, next) {
  var searchname = req.body.username;

  Transaction.find({ policymakerUsername: searchname }, (err, transactions) => {
    if (err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else if (!transactions) {
      res.type('html').status(400);
      res.write('No patrons have donated to this policymaker');
      res.end();
    } else {
      res.json(transactions);
    }
  });
});

router.use('/findvotingrecords', function(req, res, next) {
  Record.find((err, records) => {
    if (err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else if (!records) {
      res.type('html').status(400);
      res.write('No records are available at this time.');
      res.end();
    } else {
      res.json(records);
    }
  });
});

router.use('/setvote', function(req, res, next) {
  Record.findOne({ title: req.body.title }, (err, record) => {
    if (err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else if (!record) {
      res.type('html').status(400);
      res.write('There was no record matching that title');
      res.end();
    } else {
      if (req.body.vote == 'yay') {
        record.votedYes.push(req.body.username);
        if (record.votedNo.includes(req.body.username)) {
          record.votedNo.splice(record.votedNo.indexOf(req.body.username), 1);
        }
      } else if (req.body.vote == 'nay') {
        record.votedNo.push(req.body.username);
        if (record.votedYes.includes(req.body.username)) {
          record.votedYes.splice(record.votedYes.indexOf(req.body.username), 1);
        }
      } else {
        if (record.votedYes.includes(req.body.username)) {
          record.votedYes.splice(record.votedYes.indexOf(req.body.username), 1);
        }
        if (record.votedNo.includes(req.body.username)) {
          record.votedNo.splice(record.votedNo.indexOf(req.body.username), 1);
        }
      }

      record.save(err => {
        if (err) {
          res.type('html').status(400);
          res.write('uh oh: ' + err);
          console.log(err);
          res.end();
        } else {
          // send back succesful
          res.type('html').status(200);
          res.json(req.body);
        }
      });
    }
  });
});

router.use('/getmessages', function(req, res, next) {
  Message.find((err, messages) => {
    if (err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else if (!messages) {
      res.type('html').status(400);
      res.write('No messages are available at this time.');
      res.end();
    } else {
      res.json(messages);
    }
  });
});

router.post('/postmessage', function(req, res, next) {
  var message = new Message({
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
    username: req.body.username,
    topics: req.body.topics,
    name: req.body.name,
  });

  // save the message to the database
  message.save(err => {
    if (err) {
      res.type('html').status(400);
      res.write('uh oh: ' + err);
      console.log(err);
      res.end();
    } else {
      // send back succesful
      res.type('html').status(200);
      res.json(req.body);
    }
  });
});

router.post('/deletemessage', function(req, res, next) {
  Message.remove({ title: req.body.title, username: req.body.username }, (err, result) => {
    if (err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else if (!result) {
      res.type('html').status(400);
      res.write('The message could not be deleted.');
      res.end();
    } else {
      res.json(result);
    }
  });
});

router.use('/gettopics', function(req, res, next) {
  Topic.find((err, topics) => {
    if (err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else if (!topics) {
      res.type('html').status(400);
      res.write('No causes are available at this time.');
      res.end();
    } else {
      res.json(topics);
    }
  });
});

router.post('/updatetopics', function(req, res, next) {
  var searchname = req.body.username;
  // find the policymaker
  Policymaker.findOne({ username: searchname }, (err, policymaker) => {
    if (err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else if (!policymaker) {
      res.type('html').status(400);
      res.write('There are no policymakers with that name');
      res.end();
    } else {
      policymaker.chosenTopics = req.body.topics;
      policymaker.save(err => {
        if (err) {
          res.type('html').status(400);
          res.write('uh oh: ' + err);
          console.log(err);
          res.end();
        } else {
          // send back successful
          res.type('html').status(200);
          console.log('success')
          res.json(req.body);
        }
      });
    }
  });
});

router.post('/updateinfo', function(req, res, next) {
  var searchname = req.body.username;
  // find the policymaker
  Policymaker.findOne({ username: searchname }, (err, policymaker) => {
    if (err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else if (!policymaker) {
      res.type('html').status(400);
      res.write('There are no policymakers with that name');
      res.end();
    } else {
      policymaker.email = req.body.email;
      policymaker.affiliation = req.body.affiliation;
      policymaker.blurb = req.body.blurb;
      policymaker.save(err => {
        if (err) {
          res.type('html').status(400);
          res.write('uh oh: ' + err);
          console.log(err);
          res.end();
        } else {
          // send back successful
          res.type('html').status(200);
          res.json(req.body);
        }
      });
    }
  });
});

router.post('/resetpassword', function(req, res, next) {
  var searchname = req.body.username;
  // find the policymaker
  Policymaker.findOne({ username: searchname }, (err, policymaker) => {
    if (err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else if (!policymaker) {
      res.type('html').status(400);
      res.write('There are no policymakers with that name');
      res.end();
    } else {
      policymaker.password = req.body.password;
      policymaker.save(err => {
        if (err) {
          res.type('html').status(400);
          res.write('uh oh: ' + err);
          console.log(err);
          res.end();
        } else {
          // send back successful
          res.type('html').status(200);
          res.json(req.body);
        }
      });
    }
  });
});

router.post('/getemail', function(req, res, next) {
  var searchname = req.body.username;
  Policymaker.findOne({ username: searchname }, (err, policymaker) => {
    if (err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else if (!policymaker) {
      res.type('html').status(400);
      res.write('No users exist with this username.');
      res.end();
    } else {
      res.json(policymaker);
    }
  });
});

router.post('/sendemail', function(req, res, next) {
  var email = req.body.email;
  var code = req.body.code;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'policymaker.app@gmail.com',
      pass: 'policymaker!',
    },
  });
  var mailOptions = {
    from: 'policymaker.app@gmail.com',
    to: email,
    subject: 'Policymaker App Password Reset - Code: ' + code,
    text: 'Code: ' + code,
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});

router.post('/createTransactions', function(req, res, next) {
  var transaction = new Transaction({
    patronUsername: req.body.patronUsername,
    policymakerUsername: req.body.policymakerUsername,
    amount: req.body.amount,
    behavior: req.body.behavior,
    day: req.body.day,
    month: req.body.month,
    year: req.body.year,
  });

  transaction.save(err => {
    if (err) {
      res.type('html').status(400);
      res.write('uh oh: ' + err);
      console.log(err);
      res.end();
    } else {
      // send back succesful
      res.type('html').status(200);
      res.json(req.body);
    }
  });
});

router.post('/deleteaccount', function(req, res, next) {
  var searchname = req.body.username;
  Policymaker.findOneAndRemove({ username: searchname }, (err, code) => {
    if (err) {
      res.type('html').status(400);
      console.log('uh oh' + err);
      res.write(err);
    } else {
      res.type('html').status(200);
      res.json(req.body);
    }
  });
});

module.exports = router;
