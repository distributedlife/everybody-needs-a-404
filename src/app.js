'use strict';

var express = require('express');
var request = require('request');
var contains = require('lodash').contains;
var app = express();

var mode = '200';
var delay = 0;
var trueSource;
var modifiedUrls = [];

app.get('/setDelay/:delay', function (req, res) {
  delay = req.params.delay;

  res.send("Delay set to " + delay);
});

app.get('/setMode/:mode', function (req, res) {
  mode = req.params.mode;

  res.send("Mode set to " + mode);
});

function ProxyRequest (req, res, next) {
  if (mode !== '200' && mode !== 'altered') {
    res.sendStatus(parseInt(mode, 10));
    return;
  }

  function afterThePause () {
    if (contains(modifiedUrls, req.url)) {
      next();
    } else {
      request(trueSource + req.url, function (req2, res2) {
        res.send(res2.body);
      });
    }
  }

  setTimeout(afterThePause, delay);
}
app.use(ProxyRequest);

function modify(url, callback) {
  modifiedUrls.push(url);

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