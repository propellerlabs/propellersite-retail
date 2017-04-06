var express = require('express');
var nodemailer = require('nodemailer');

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
