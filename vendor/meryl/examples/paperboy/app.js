var meryl = require('../../index');

meryl
  .p(function (req, resp, next) {
    require('paperboy')
      .deliver(__dirname, req, resp)
      .addHeader('Expires', 300)
      .error(function (statCode, msg) {
        next();
      })
      .otherwise(function (err) {
        next();
      });
  })
  .h('GET /', function (req, resp) {
    resp.end("<h1>Welcome To NodeJS!</h1><img src='nodejs.png' />");
  })
  .run();

console.log('listening...');

