var meryl = require('../../index'),
  jade = require('jade');

var opts = {
  templateDir: 'templates',
  templateExt: '.jade',
  templateFunc: function (src, data) {
    return jade.render(src, {locals: data});
  }
};

meryl
  .h('GET /', function (req, resp) {
      resp.render('layout',
        {content: 'home', context: {people: ['bob', 'alice', 'jane', 'meryl']}});
    }
  )
  .run(opts);

console.log('listening...');

