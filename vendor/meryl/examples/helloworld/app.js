var meryl = require('../../index');
  
meryl
  .h('GET /', function (req, resp) {
    resp.end("<h1>Hello World!</h1>");
  })
  .run();

console.log('listening...');

