'use strict';

var each = require('lodash').each;

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
    app.rewriteUrl(rewrite[0], rewrite[1]);
  });

  app.listen(port, function () {
    var versionInfo = require('../package.json');
      console.log('%s@%s listening on %s', versionInfo.name, versionInfo.version, port);
  });
}

function addModification (url, callback) {
  modifications.push([url, callback]);
}

function rewriteUrl (url, callback) {
  rewrites.push([url, callback]);
}

var proxy = {
  modify: addModification,
  rewriteUrl: rewriteUrl,
  go: go
};

module.exports = proxy;