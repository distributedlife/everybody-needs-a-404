'use strict';

var each = require('lodash').each;
var request = require('request');

var modifications = [];
var rewrites = [];

function go(url) {
  var app = require('./app');
  var port = process.env.PORT || 3000;

  app.setSourceOfTruth(url);

  each(modifications, function(modification) {
    app.modify(modification[0], modification[1]);
  });

  each(rewrites, function(rewrite) {
    app.rewriteUrl(rewrite[0], rewrite[1], rewrite[2]);
  });

  app.use(function(err, req, res, next) {
    console.error(err);
    next(err);
  });

  app.use(function(req, res) {
    console.log('Unaltered request to ' + req.url);

    req.pipe(request(url + req.url)).pipe(res);
  });

  app.use(function(err, req, res) {
    res.status(500);
    res.render('error', { error: err });
  });

  app.listen(port, function () {
    var versionInfo = require('../package.json');
      console.log('%s@%s listening on %s', versionInfo.name, versionInfo.version, port);
  });
}

function addModification (url, callback) {
  modifications.push([url, callback]);
}

function rewriteUrl (url, rewriteCallback, modifyCallback) {
  rewrites.push([url, rewriteCallback, modifyCallback]);
}

var proxy = {
  modify: addModification,
  rewriteUrl: rewriteUrl,
  go: go
};

module.exports = proxy;