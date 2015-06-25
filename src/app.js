'use strict';

var express = require('express');
var request = require('request');
var app = express();

var mode = '200';
var trueSource;

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

function setSourceOfTruth (url) {
  trueSource = url;
}

app.setSourceOfTruth = setSourceOfTruth;
app.modify = modify;

module.exports = app;