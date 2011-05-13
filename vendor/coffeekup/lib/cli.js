(function() {
  var OptionParser, argv, coffeekup, fs, options, path, puts, render, switches, usage, write;
  coffeekup = require('./coffeekup');
  fs = require('fs');
  path = require('path');
  puts = console.log;
  OptionParser = require('coffee-script/lib/optparse').OptionParser;
  argv = process.argv.slice(2);
  options = null;
  render = function(input_path, output_directory) {
    return fs.readFile(input_path, function(err, contents) {
      var html;
      if (err) {
        throw err;
      }
      html = coffeekup.render(String(contents), options);
      return write(input_path, html, output_directory);
    });
  };
  write = function(input_path, html, output_directory) {
    var dir, filename;
    filename = path.basename(input_path, path.extname(input_path)) + '.html';
    dir = output_directory || path.dirname(input_path);
    return path.exists(dir, function(exists) {
      var output_path;
      if (!exists) {
        fs.mkdirSync(dir, 0777);
      }
      output_path = path.join(dir, filename);
      if (html.length <= 0) {
        html = ' ';
      }
      return fs.writeFile(output_path, html, function(err) {
        if (err) {
          throw err;
        }
        if (options.print) {
          puts(html);
        }
        if (options.watch) {
          return puts("Compiled " + input_path);
        }
      });
    });
  };
  usage = 'Usage:\n  coffeekup [options] path/to/template.coffee';
  switches = [['-w', '--watch', 'watch templates for changes, and recompile'], ['-o', '--output [dir]', 'set the directory for compiled html'], ['-p', '--print', 'print the compiled html to stdout'], ['-f', '--format', 'apply line breaks and indentation to html output'], ['-u', '--utils', 'add helper locals (currently only "render")'], ['-v', '--version', 'display CoffeeKup version'], ['-h', '--help', 'display this help message']];
  this.run = function() {
    var args, file, parser, _ref;
    parser = new OptionParser(switches, usage);
    options = parser.parse(argv);
    args = options.arguments;
    delete options.arguments;
    if (options.help || argv.length === 0) {
      puts(parser.help());
    }
    if (options.version) {
      puts(coffeekup.version);
    }
    if (options.utils) {
            if ((_ref = options.locals) != null) {
        _ref;
      } else {
        options.locals = {};
      };
      options.locals.render = function(file) {
        var contents;
        contents = fs.readFileSync(file);
        return coffeekup.render(String(contents), options);
      };
    }
    if (args.length > 0) {
      file = args[0];
      if (options.watch) {
        return fs.watchFile(file, {
          persistent: true,
          interval: 500
        }, function(curr, prev) {
          if (curr.size === prev.size && curr.mtime.getTime() === prev.mtime.getTime()) {
            return;
          }
          return render(file, options.output);
        });
      } else {
        return render(file, options.output);
      }
    }
  };
}).call(this);
