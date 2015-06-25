'use strict';

var modifications = [];

function go() {
  var app = require('./app');
  var port = process.env.PORT || 3000;

  var length = modifications.length;
  for (var i = 0; i < length; i++) {
    var modification = modifications[i];

    app.modify(modification[0], modification[1]);
  }

  var server = app.listen(port, function () {
    var versionInfo = require('../package.json');
      console.log('%s@%s listening on %s', versionInfo.name, versionInfo.version, port);
  });
}

function addModification (url, callback) {
  modifications.push([url, callback]);
}
var proxy = {
  modify: addModification,
  go: go
};

module.exports = proxy;