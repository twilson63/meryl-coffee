var meryl = require('./../index').factory,
  httputil = require('nodeunit').utils.httputil,
  async = require('async');

exports.testDefaultNotFoundHandler = function (test) {
  httputil(
    meryl().cgi(),
    function (server, client) {
      client.fetch('GET', '/', {}, function (resp) {
          test.equal(404, resp.statusCode);
          server.close();
          test.done();
        }
      );
    }
  );
};

exports.testCustomtNotFoundHandler = function (test) {
  httputil(
    meryl()
      .handleNotFound(function (req, resp) {
          resp.statusCode = 405;
          resp.end('test data');
        }
      )
      .cgi(),
    function (server, client) {
      client.fetch('GET', '/', {}, function (resp) {
          test.equal(405, resp.statusCode);
          test.equal('test data', resp.body);
          server.close();
          test.done();
        }
      );
    }
  );
};

exports.testDefaultErrorHandler = function (test) {
  httputil(
    meryl()
      .h('GET /', function (req, resp) {
        throw 'test error';
      })
      .cgi(),
    function (server, client) {
      client.fetch('GET', '/', {}, function (resp) {
          test.equal(500, resp.statusCode);
          server.close();
          test.done();
        }
      );
    }
  );
};

exports.testCustomErrorHandler = function (test) {
  httputil(
    meryl()
      .handleError(function (req, resp, err) {
          resp.statusCode = 501;
          resp.end(err);
        }
      )
      .h('GET /', function (req, resp) {
        throw 'test data';
      })
      .cgi(),
    function (server, client) {
      client.fetch('GET', '/', {}, function (resp) {
          test.equal(501, resp.statusCode);
          test.equal('test data', resp.body);
          server.close();
          test.done();
        }
      );
    }
  );
};

exports.testPluginChaining = function (test) {
  httputil(
    meryl()
      .p(function (req, resp, next) {
        resp.setHeader('plugin1', true);
        next();
      })
      .p('*', function (req, resp, next) {
        resp.setHeader('plugin2', true);
        next();
      })
      .p('GET *', function (req, resp, next) {
        resp.setHeader('plugin3', true);
        next();
      })
      .p('GET /', function (req, resp, next) {
        resp.setHeader('plugin4', true);
        next();
      })
      .p('GET /private', function (req, resp, next) {
        resp.statusCode = 403;
        throw new Error();
      })
      .p('POST /', function (req, resp, next) {
        resp.setHeader('plugin5', true);
        next();
      })
      .h('GET /', function (req, resp) {
        resp.end('test data');
      })
      .cgi(),
    function (server, client) {
      async.series([
        function (ok) {
          client.fetch('GET', '/', {}, function (resp) {
              test.equal(200, resp.statusCode);
              test.ok(resp.headers.plugin1);
              test.ok(resp.headers.plugin2);
              test.ok(resp.headers.plugin3);
              test.ok(resp.headers.plugin4);
              test.ok(!resp.headers.plugin5);
              test.equal('test data', resp.body);
              ok();
            }
          );
        },
        function (ok) {
          client.fetch('POST', '/', {}, function (resp) {
              test.equal(404, resp.statusCode);
              test.ok(resp.headers.plugin1);
              test.ok(resp.headers.plugin2);
              test.ok(!resp.headers.plugin3);
              test.ok(!resp.headers.plugin4);
              test.ok(resp.headers.plugin5);
              ok();
            }
          );
        },
        function (ok) {
          client.fetch('GET', '/private', {}, function (resp) {
              test.equal(403, resp.statusCode);
              test.ok(resp.headers.plugin1);
              test.ok(resp.headers.plugin2);
              test.ok(resp.headers.plugin3);
              test.ok(!resp.headers.plugin4);
              test.ok(!resp.headers.plugin5);
              ok();
            }
          );
        },
        function (ok) {
          server.close();
          test.done();
          ok();
        }
      ]);
    }
  );
};

