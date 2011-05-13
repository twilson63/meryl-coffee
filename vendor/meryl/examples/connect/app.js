var Connect = require('connect'),
  meryl = require('../../index');

meryl
  .p(
    function (req, resp, next) {
      resp.setHeader('backend', 'nodejs/connect/meryl');
      next();
    },
    Connect.logger()
  )  
  .p('GET *',
    Connect.favicon(),
    Connect.static(".")
  )
  .h('GET /', function (req, resp) {
    resp.end("<h1>Welcome To NodeJS!</h1><img src='nodejs.png' />");
  })
  .run();

console.log('listening...');
