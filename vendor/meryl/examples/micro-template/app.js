var meryl = require('../../index');

meryl
  .h('GET /', function (req, resp) {
      resp.render('layout', {content: 'home', context: {foo: 'bar'}});
    }
  )
  .run();

console.log('listening...');

