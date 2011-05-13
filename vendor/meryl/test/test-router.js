var meryl = require('./../index').factory,
  httputil = require('nodeunit').utils.httputil,
  async = require('async');

exports.testSinglePathVar = function (test) {
  httputil(
    meryl()
      .h('GET /{param1}', function (req, resp) {
        resp.setHeader('content-type', 'application/json');
        resp.end(JSON.stringify(req.params));
      })
      .cgi(),
    function (server, client) {
      async.series([
        function (ok) {
          client.fetch('GET', '/test1', {}, function (resp) {
              test.equal(200, resp.statusCode);
              test.equal('test1', resp.bodyAsObject.param1);
              ok();
            }
          );
        },
        function (ok) {
          client.fetch('GET', '/test1/test2', {}, function (resp) {
              test.equal(404, resp.statusCode);
              ok();
            }
          );
        },
        function (ok) {
          client.fetch('GET', '/', {}, function (resp) {
              test.equal(404, resp.statusCode);
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

exports.testSingleGreedyPathVar = function (test) {
  httputil(
    meryl()
      .h('GET /<param1>', function (req, resp) {
        resp.setHeader('content-type', 'application/json');
        resp.end(JSON.stringify(req.params));
      })
      .cgi(),
    function (server, client) {
      async.series([
        function (ok) {
          client.fetch('GET', '/test1/test2/test3', {}, function (resp) {
              test.equal(200, resp.statusCode);
              test.equal('test1/test2/test3', resp.bodyAsObject.param1);
              ok();
            }
          );
        },
        function (ok) {
          client.fetch('GET', '/', {}, function (resp) {
              test.equal(404, resp.statusCode);
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

exports.testMultiplePathVars = function (test) {
  httputil(
    meryl()
      .h('GET /{param1}/{param2}/{param3}', function (req, resp) {
        resp.setHeader('content-type', 'application/json');
        resp.end(JSON.stringify(req.params));
      })
      .cgi(),
    function (server, client) {
      async.series([
        function (ok) {
          client.fetch('GET', '/test1/test2/test3', {}, function (resp) {
              test.equal(200, resp.statusCode);
              test.equal('test1', resp.bodyAsObject.param1);
              test.equal('test2', resp.bodyAsObject.param2);
              test.equal('test3', resp.bodyAsObject.param3);
              ok();
            }
          );
        },
        function (ok) {
          client.fetch('GET', '/test1/test2/test3/test4', {}, function (resp) {
              test.equal(404, resp.statusCode);
              ok();
            }
          );
        },
        function (ok) {
          client.fetch('GET', '/', {}, function (resp) {
              test.equal(404, resp.statusCode);
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

exports.testMultipleGreedyPathVars = function (test) {
  httputil(
    meryl()
      .h('GET /<param1>/<param2>', function (req, resp) {
        resp.setHeader('content-type', 'application/json');
        resp.end(JSON.stringify(req.params));
      })
      .cgi(),
    function (server, client) {
      async.series([
        function (ok) {
          client.fetch('GET', '/test1/test2/test3', {}, function (resp) {
              test.equal(200, resp.statusCode);
              test.equal('test1/test2', resp.bodyAsObject.param1);
              test.equal('test3', resp.bodyAsObject.param2);
              ok();
            }
          );
        },
        function (ok) {
          client.fetch('GET', '/', {}, function (resp) {
              test.equal(404, resp.statusCode);
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

exports.testMixedTypesOfPathVars = function (test) {
  httputil(
    meryl()
      .h('GET /{param1}/<param2>/{param3}', function (req, resp) {
        resp.setHeader('content-type', 'application/json');
        resp.end(JSON.stringify(req.params));
      })
      .cgi(),
    function (server, client) {
      async.series([
        function (ok) {
          client.fetch('GET', '/test1/test2/test3/test4/test5', {}, function (resp) {
              test.equal(200, resp.statusCode);
              test.equal('test1', resp.bodyAsObject.param1);
              test.equal('test2/test3/test4', resp.bodyAsObject.param2);
              test.equal('test5', resp.bodyAsObject.param3);
              ok();
            }
          );
        },
        function (ok) {
          client.fetch('GET', '/', {}, function (resp) {
              test.equal(404, resp.statusCode);
              ok();
            }
          );
        },
        function (ok) {
          client.fetch('GET', '/test1/test2/test3/test4/test5/', {}, function (resp) {
              test.equal(404, resp.statusCode);
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
