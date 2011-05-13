var meryl = require('./../../index');

/**
 * This example shows some advanced use of Meryl.
 * Please note that chaining of Meryl functions
 * and their verbose names instead of single letter ones.
 */
 
require('http').createServer(
  meryl
  
    .plug(function (req, resp, next) {
      resp.filteredSend = function (buffer) {
        resp.end("<h1>" + buffer.toString() + "</h1>");
      };
      next();
    })
    
    .plug(function (req, resp, next) {
      resp.setHeader('server', 'node');
      console.log(req.method + ' ' + req.params.pathname);
      next();
    })
    
    .plug('POST *', function (req, resp, next) {
      resp.statusCode = 405;
      throw new Error('method not allowed');
    })
    
    .plug('{method} /private/*', function (req, resp, next) {
      resp.statusCode = 401;
      throw new Error('access denied');
    })
    
    .handle('GET /', function (req, resp) {
      resp.end("<h1>Demonstraing Meryl</h1>");
    })
    
    .handle('GET /{pagename}.html', function (req, resp) {
      resp.filteredSend("You're reading: " + req.params.pagename);
    })
    
    .handle('GET /exception', function (req, resp) {
      resp.end(1);
    })
    
    .cgi({debug: true})
    
).listen(3000);

console.log('listening...');

