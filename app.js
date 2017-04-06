var express = require('express');
var nodemailer = require('nodemailer');

var app = express();

app.use(express.static('public'));

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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
