var meryl = require('../../index'),
  eco = require('eco');

var opts = {
  templateDir: 'templates',
  templateExt: '.eco',
  templateFunc: eco.render
};

meryl
  .h('GET /', function (req, resp) {
      resp.render('layout',
        {content: 'home', context: {people: ['bob', 'alice', 'jane', 'meryl']}});
    }
  )
  .run(opts);

console.log('listening...');

