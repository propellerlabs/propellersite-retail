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
    'Name: ' +
    '<p>' + req.body.name + '</p>' +
    'Company: ' +
    '<p>' + req.body.company + '</p>' +
    'Title: ' +
    '<p>' + req.body.title + '</p>' +
    'Phone: ' +
    '<p>' + req.body.phone + '</p>' +
    'Email: ' +
    '<p>' + req.body.email + '</p>' +
    'Additional Detail: ' +
    '<p>' + req.body.details + '</p>';

  var text =
    'Name: ' + req.body.name +
    'Company: ' + req.body.company +
    'Title: ' + req.body.title +
    'Phone: ' + req.body.phone +
    'Email: ' + req.body.email +
    'Additional Detail: ' + req.body.details;

  var email = {
    from: 'webform@propellerlabs.co',
    to: 'john@propellerlabs.co',
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
  console.log('req', req);
  console.log('consultation submit');
});

app.post('/newsletter-submit', function(req, res) {
  console.log('newsletter submit');
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
})
