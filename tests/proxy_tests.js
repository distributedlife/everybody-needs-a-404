'use strict';

var expect = require('expect');
var request = require('request');

function modified () {
  return 'Modified';
}

function rewriteAndModify (body) {
  return 'Modified' + body;
}

function ramen () {
  return '/food/ramen.html';
}

var proxy = require('../src/proxy');
proxy.rewriteUrl('/food/preserving-lemons.html', ramen);
proxy.modify('/modify-me', modified);
proxy.rewriteUrl('/space/:dish', ramen, rewriteAndModify);
proxy.go('http://distributedlife.com');

describe('when mode set to altered', function () {
  beforeEach(function (done) {
    request('http://localhost:3000/setMode/altered', done);
  });

  it('should modify payloads', function (done) {
    request('http://localhost:3000/modify-me', function (req, res) {
      expect(res.body).toEqual('Modified');
      done();
    });
  });

  it('should rewrite a url', function (done) {
    request('http://localhost:3000/food/preserving-lemons.html', function (req, res) {
      expect(res.body).toContain('Ramen');
      done();
    });
  });

  it('should rewrite a url and then modify payloads for same route', function (done) {

    request('http://localhost:3000/space/jam', function (req, res) {
      expect(res.body).toContain('Modified');
      expect(res.body).toContain('Ramen');
      done();
    });
  });
});

describe('when most is set to 200', function () {
  beforeEach(function (done) {
    request('http://localhost:3000/setMode/200', done);
  });

  it('should proxy all requests to the true source', function (done) {
    request('http://localhost:3000/food/preserving-lemons.html', function (req, res) {
      expect(res.body).toContain('Preserved Lemons');
      done();
    });
  });
});

describe('when most is set to 404', function () {
  beforeEach(function (done) {
    request('http://localhost:3000/setMode/404', done);
  });

  it('should return a 404 for all requests', function (done) {
    request('http://localhost:3000/food/ramen.html', function (req, res) {

      expect(res.statusCode).toEqual(404);
      done();
    });
  });
});