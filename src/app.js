var express = require('express');
var request = require('request');
var app = express();

var trueSource = "http://api-aws-qat2.tnet.internal";
var mode = '200';

app.get('/setMode/:mode', function (req, res) {
  mode = req.params.mode;

  res.send("Mode set to " + mode);
});

function ProxyRequest (req, res, next) {
  if (mode !== '200' && mode !== 'altered') {
    res.sendStatus(parseInt(mode, 10));
    return;
  }

  next();
}
app.use(ProxyRequest);

function modify(url, callback) {
  app.get(url, function(req, res) {

    if (mode === 'altered') {
      request(trueSource + req.url, function (req2, res2) {
        res.send(callback(res2.body));
      });
    } else {
      request(trueSource + req.url, function (req2, res2) {
        res.send(res2.body);
      });
    }

  });
}

app.modify = modify;

module.exports = app;