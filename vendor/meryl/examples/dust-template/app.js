var meryl = require('../../index'),
fs = require('fs'),
path = require('path'),
dust = require('dust');

var dataStore = {
  posts: [
    {
      key: 1,
      title: "post 1",
      date: "01/19/10"
    },
    {
      key: 2,
      title: "post 2",
      date: "01/14/10",
      content: "This is the post 2"
    },
    {
      key: 3,
      title: "post 3",
      date: "04/2/10",
      content: "This is the post 3"      
    }
  ]
};

var TEMPLATE_DIR = 'templates',
  TEMPLATE_EXT = '.html';

function initDust(onInit) {
  fs.readdir(TEMPLATE_DIR, function (err, filenames) {
    if (err) {
      throw err;
    }
    var filesRead = 0,
      templateName,
      pattern = new RegExp('\\' + TEMPLATE_EXT + '$');

    filenames.forEach(function (filename) {
      if (pattern.test(filename)) {
        fs.readFile(path.join(TEMPLATE_DIR, filename), function (err, data) {
          if (err) {
            throw err;
          }
          templateName = filename.replace(pattern, '');
          dust.loadSource(dust.compile(data.toString(), templateName));
          console.log(templateName + ' template prepared.');
          filesRead += 1;
          if (filenames.length === filesRead) {
            onInit();
          }
        });
      }
    });
  });
}

meryl
  .plug(function (req, resp, next) {
    resp.render = function (templatename, data) {
      dust.render(templatename, data, function (err, output) {
        if (err) {
          throw err;
        }
        resp.end(output);
      });
    };
    next();
  })
  .get('/', function (req, resp) {
    resp.render('main', dataStore);
  });
  
initDust(function () {
  meryl.run();
  console.log('listening...');
});
