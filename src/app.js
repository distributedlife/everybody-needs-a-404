'use strict';

var express = require('express');
var request = require('request');
var app = express();

var mode = '200';
var delay = 0;
var trueSource;
var modifiedUrls = [];

app.use(function LogAllTheThings (req, res, next) {
  console.log('Proxying request for ' + req.url);

  next();
});

app.get('/setDelay/:delay', function (req, res) {
  delay = req.params.delay;

  res.send('Delay set to ' + delay);
});

app.get('/setMode/:mode', function (req, res) {
  mode = req.params.mode;

  res.send('Mode set to ' + mode);
});

function PauseForEFfect (req, res, next) {
  if (mode !== '200' && mode !== 'altered') {
    res.sendStatus(parseInt(mode, 10));
    return;
  }

  setTimeout(next, delay);
}
app.use(PauseForEFfect);

function makeRequestToTrueSource (url, res) {
  request(trueSource + url, function (req2, res2) {
    res.send(res2.body);
  });
}

function makeAndModifyRequest (req, res, callback) {
  console.log('Modify response for ', req.url);

  request(trueSource + req.url, function (req2, res2) {
    if (res2.statusCode === 404) {
      res.sendStatus(404);
    } else {
      res.send(callback(res2.body, req));
    }
  });
}

function modifyResponse(url, callback) {
  modifiedUrls[url] = callback;

  app.get(url, function(req, res) {
    if (mode !== 'altered') {
      makeRequestToTrueSource(req.originalUrl, res);
    } else {
      makeAndModifyRequest(req, res, callback);
    }
  });
}

function rewriteUrl(url, rewriteCallback, modifyCallback) {
  app.use(url, function (req, res) {
    if (mode !== 'altered') {
      makeRequestToTrueSource(req.originalUrl, res);
      return;
    }

    req.url = rewriteCallback(req);

    console.log('Url rewrite for ', req.originalUrl, 'to', req.url);

    if (modifyCallback) {
      makeAndModifyRequest(req, res, modifyCallback);
    } else {
      makeRequestToTrueSource(req.url, res);
    }
  });
}

function setSourceOfTruth (url) {
  trueSource = url;
}

app.setSourceOfTruth = setSourceOfTruth;
app.modify = modifyResponse;
app.rewriteUrl = rewriteUrl;

module.exports = app;