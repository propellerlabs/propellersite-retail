var express = require('express');
var nodemailer = require('nodemailer');

var options = {
  auth: {
    api_user: process.env.SENDGRID_USERNAME,
    api_key: process.env.SENDGRID_PASSWORD
  }
}

var client = nodemailer.createTransport(sgTransport(options));

var email = {
  from: 'webform@propellerlabs.co',
  to: 'john@propellerlabs.co',
  subject: 'Hello',
  text: 'Hello world',
  html: '<b>Hello world</b>'
};

var app = express();

app.use(express.static('public'));
app.set('port', (process.env.PORT || 3000));

app.get('/', function (req, res) {
  res.sendFile(__dirname + 'public/index.html');
});

app.get('*', function (req, res) {
  res.redirect('/');
});

app.post('/start-submit', function(req, res) {
  client.sendMail(email, function(err, info){
      if (err ){
        console.log(error);
      }
      else {
        console.log('Message sent: ' + info.response);
      }
  });
});

app.post('/consultation-submit', function(req, res) {
  console.log('consultation submit');
});

app.post('/newsletter-submit', function(req, res) {
  console.log('newsletter submit');
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
})
