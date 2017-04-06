var express = require('express');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var bodyParser = require('body-parser');

var options = {
  auth: {
    api_user: process.env.SENDGRID_USERNAME,
    api_key: process.env.SENDGRID_PASSWORD
  }
}

var client = nodemailer.createTransport(sgTransport(options));


var app = express();

app.use(express.static('public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('port', (process.env.PORT || 3000));

app.get('/', function (req, res) {
  res.sendFile(__dirname + 'public/index.html');
});

app.get('*', function (req, res) {
  res.redirect('/');
});

app.post('/start-submit', function(req, res) {
  var body =
    '<b>Name:</b> ' +
    '<p>' + req.body.name + '</p>' +
    '<b>Company:</b> ' +
    '<p>' + req.body.company + '</p>' +
    '<b>Title:</b> ' +
    '<p>' + req.body.title + '</p>' +
    '<b>Phone:</b> ' +
    '<p>' + req.body.phone + '</p>' +
    '<b>Email:</b> ' +
    '<p>' + req.body.email + '</p>' +
    '<b>Additional Detail:</b> ' +
    '<p>' + req.body.details + '</p>';

  var text =
    'Name: ' + req.body.name +
    'Company: ' + req.body.company +
    'Title: ' + req.body.title +
    'Phone: ' + req.body.phone +
    'Email: ' + req.body.email +
    'Additional Details: ' + req.body.details;

  var email = {
    from: 'webform@propellerlabs.co',
    to: process.env.EMAIL_SEND_TO,
    subject: 'Start a project submission',
    text: text,
    html: body
  };

  client.sendMail(email, function(err, info){
    if (err){
      console.log(err);
    }
    else {
      console.log('Message sent: ' + info.response);
    }
  });
  res.redirect('/');
});

app.post('/consultation-submit', function(req, res) {
  var body =
    '<b>Name:</b> ' +
    '<p>' + req.body.name + '</p>' +
    '<b>Location:</b> ' +
    '<p>' + req.body.location + '</p>' +
    '<b>Company:</b> ' +
    '<p>' + req.body.company + '</p>' +
    '<b>Title:</b> ' +
    '<p>' + req.body.title + '</p>' +
    '<b>Phone:</b> ' +
    '<p>' + req.body.phone + '</p>' +
    '<b>Email:</b> ' +
    '<p>' + req.body.email + '</p>' +
    '<b>Additional Detail:</b> ' +
    '<p>' + req.body.details + '</p>';

  var text =
    'Name: ' + req.body.name +
    'Location: ' + req.body.location +
    'Company: ' + req.body.company +
    'Title: ' + req.body.title +
    'Phone: ' + req.body.phone +
    'Email: ' + req.body.email +
    'Additional Details: ' + req.body.details;

  var email = {
    from: 'webform@propellerlabs.co',
    to: process.env.EMAIL_SEND_TO,
    subject: 'Request free consultation submission',
    text: text,
    html: body
  };

  client.sendMail(email, function(err, info){
    if (err){
      console.log(err);
    }
    else {
      console.log('Message sent: ' + info.response);
    }
  });
  res.redirect('/');
});

app.post('/newsletter-submit', function(req, res) {
  console.log('newsletter submit');
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
})
