/*!
 * Meryl
 * Copyright(c) 2010 Kadir Pekel.
 * MIT Licensed
 */

/**
 * Module dependencies
 */
var sys = require('sys'),
  http = require('http'),
  url = require('url'),
  fs = require('fs'),
  path = require('path');


/**
 * Default encoding
 */
var __encoding = 'utf-8';
  
/*
 * Merges two objects. Source object overrides to destination
 * 
 * @param {Object} src
 * @param {Object} dest
 * @return {Object}
 * @api private
 */
Object.merge = function (src, dest) {
  if (src && dest) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dest[key] = src[key];
      }
    }
  }
  return dest;
};

/*
 * This function renders source string with given data which uses
 * John Ressig's micro templating implementation of underscore.js
 *
 * @param {String} source
 * @param {Object} data
 * @return {String}  
 * @api private
 */

var microtemplate = function (str, data) {
  var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
    'with(obj||{}){__p.push(\'' +
    str.replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/<%=([\s\S]+?)%>/g, function (match, code) {
        return "'," + code.replace(/\\'/g, "'") + ",'";
      })
      .replace(/<%([\s\S]+?)%>/g || null, function (match, code) {
        return "');" + code.replace(/\\'/g, "'")
                          .replace(/[\r\n\t]/g, ' ') + "__p.push('";
      })
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t') + "');}return __p.join('');";
  var func = new Function('obj', tmpl);
  return data ? func(data) : func;
};

/*
 * Parses path expression and extract path variables
 *
 * @param {String} expr
 * @param {String} path
 * @return {Object}
 * @api private
 */
var matchPathExpression = function (expr, path) {
  var p1 = '{([^}]+)}',
      p2 = '<([^>]+)>',
      rA = new RegExp('(?:' + p1 + ')|(?:' + p2 + ')', 'gi'),
      keys = [],
      values = null,
      capture = null;
  while ((capture = rA.exec(expr))) {
    keys.push(capture[1] || capture[2]);
  }
  var rB = new RegExp('^' + expr.replace(/\(/, '(?:', 'gi')
    .replace(/\./, '\\.', 'gi')
    .replace(/\*/, '.*', 'gi')
    .replace(new RegExp(p1, 'gi'), '([^/\\.\\?]+)')
    .replace(new RegExp(p2, 'gi'), '(.+)') + '$');

  if ((values = rB.exec(path))) {
    var result = {};
    values.shift();
    if (values.length === keys.length) {
      for (var i = 0; i < keys.length; i++) {
        result[keys[i]] = values[i];
      }
    } else {
      throw new Error('Inconsistent path expression');
    }
    return result;
  }
  return null;
};

/**
 * Meryl core object
 */
function Meryl() {
  // Handler registry
  this.handlers = [];
  // Plugin registry
  this.plugins = [];
  // Option registry
  this.options =  {
    templateDir: '',
    templateExt: '.jshtml',
    templateFunc: microtemplate
  };
  
  // Aliases
  this.h = this.handle;
  this.p = this.plug;
}

Meryl.prototype = {

  /*
   * Default not found handler definition
   *
   * @param {Object} req
   * @param {Object} resp
   * @api private
   */
  _notFoundHandler: function (req, resp) {
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      resp.statusCode = 404;
    }
    resp.end('<h3>Not Found</h3><pre>' + req.params.pathname + '</pre>');
  },

  /*
   * Default error handler definition
   *
   * @param {Object} req
   * @param {Object} resp
   * @return {Object} e
   * @api private
   */
  _errorHandler: function (req, resp, e) {
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      resp.statusCode = 500;
    }
    resp.end('<h3>Server error</h3><pre>' +
      ((e instanceof Error && this.options.debug) ? e.stack : e) + '</pre>');
  },

  /*
   * Process incoming requests and do main routing
   * operations through handlers and plugins by chaining matched
   * ones with each other
   *
   * @param {Array} infra
   * @param {Object} req
   * @param {Object} resp
   * @return {undefined}
   * @api private
   */
  _proc: function (infra, ctx, req, resp) {
    var self = this;
    var i = 0;
    function next() {
      var procunit = infra[i];
      i += 1;
      if (procunit && procunit.pattern) {
        var parts = matchPathExpression(procunit.pattern, req.method +
          ' ' + req.params.pathname);
        if (parts) {
          if (procunit.cb) {
            Object.merge(parts, req.params);
            Object.merge(req.params.query, req.params);
            procunit.cb.call(ctx, req, resp, next);
          }
        } else {
          next();
        }
      }
    }
    try {
      next();
    } catch (e) {
      if (this._errorHandler) {
        this._errorHandler.call(ctx, req, resp, e);
      } else {
        throw e;
      }
    }
  },
  
  /*
   * Handler registration function
   *
   * @param {String} pattern
   * @param {Function} callback
   * @return {Object} this
   * @api public
   */
  handle: function (pattern, callback) {
    this.handlers.push({pattern: pattern, cb: callback});
    return this;
  },

  /*
   * Plugin registration function
   *
   * @param {Array} [pattern ,] callbacks
   * @return {Object} this
   * @api public
   */
  plug: function () {
    var args = Array.prototype.slice.call(arguments),
      first = args.shift(),
      pattern = '*',
      callback = first;
    if (typeof first === 'string') {
      pattern = first;
      callback = args.shift();
    }
    do {
      this.plugins.push({pattern: pattern, cb: callback});
    } while ((callback = args.shift()));
    return this;
  },

  /*
   * Function for defining a custom error handler
   *
   * @param {Function} callback
   * @return {Object} this
   * @api public
   */
  handleError: function (callback) {
    this._errorHandler = callback;
    return this;
  },

  /*
   * Function for defining a custom not found handler
   *
   * @param {Function} callback
   * @return {Object} this
   * @api public
   */
  handleNotFound: function (callback) {
    this._notFoundHandler = callback;
    return this;
  },

  /*
   * A simple factory to able to create multiple
   * distinct Meryl instances outside module
   */
  factory: function () {
    return new Meryl();
  },
  
  /*
   * Shorthand helper function for running Meryl
   * instantly using inner cgi
   * @param {Number} port
   * @param {String} hostname
   * @api public
   */
  run: function (opts) {
    var server = http.createServer(this.cgi(opts));
    server.listen(this.options.port || process.env.PORT || 3000,
      this.options.hostname || process.env.HOSTNAME || 'localhost');
    return server;
  },
  
  /*
   * Funny helper function for constructing Meryl applications
   * in (fab) flavored style
   */
  fabby: function () {
    var self = this;
    function contextCarrier() {
      if (!arguments.length ||
        (arguments.length === 1 && typeof arguments[0] === 'object')) {
        return self.run(arguments[0]);
      } else {
        self.plug.apply(self, arguments);
        return contextCarrier;
      }
    }
    return contextCarrier.apply(self, arguments);
  },
  
  /*
   * Main entry point of Meryl. It pushes some initial
   * preperations for handling http requests.
   *
   * Examples:
   *
   *  require('http').createServer(meryl.cgi()).listen(3000);
   *
   * @return {Function}
   * @api public
   */
  cgi: function (opts) {
    var self = this;
    self.options = Object.merge(opts || {}, self.options);
    var infra = self.plugins.concat(self.handlers);
    infra.push({pattern: '* <templatename>', cb: function (req, resp, next) {
      try {
        resp.render(req.params.templatename);
      } catch (e) {
        if (e === 'template not found') {
          next();
        } else {
          throw e;
        }
      }
    }});
    
    infra.push({pattern: '*', cb: self._notFoundHandler});
    
    return function (req, resp) {
      // Set default status code
      resp.statusCode = 200;
      // Also default content-type
      resp.setHeader('content-type', 'text/html');
      req.meryl = resp.meryl = self;
      resp.request = req;
      req.params = url.parse(req.url, true);
      req.addListener('data', function (data) {
        if (!req.postdata) {
          req.postdata = data;
        } else {
          req.postdata += data;
        }
      }).addListener('end', function () {    
        self._proc(infra, self, req, resp);
      });
    };
  }
};  

/*
 * Extend http.ServerResponse to add simple http redirecting helper
 *
 * Examples:
 *
 *  resp.redirect('/another_page');
 *
 * @param {String} location
 * @api public
 */
http.ServerResponse.prototype.redirect = function (location) {
  this.writeHead(301, {'Location': location});
  this.end();
};

/*
 * Extend http.ServerResponse to add template rendering feature.
 * The first argument 'templateName' is the name of template without file extension.
 * The default template extension is 'jshtml'. You can change it by
 * configuring 'meryl' options. The second argument 'ctx' is the context object
 * which is used as a data holder while rendering given template
 *
 * Examples:
 *
 *  resp.render('templateNameWithoutExt', {myvar: 'myvalue'})
 *
 * @param {String} templateName
 * @param {Object} ctx
 * @api public
 */
http.ServerResponse.prototype.render = function (templateName, ctx) {
  var self = this;
  function render(templateName, data) {
    templateName = templateName || '/';
    templateName = templateName.replace(/\.\.+/, '\\.', 'g');
    data = data || {};
    data.request = self.request;
    data.response = self;
    data.render = render;
    if (templateName[templateName.length - 1] === '/') {
      templateName += 'index';
    }
    var templatePath = path.join(process.cwd(),
      self.meryl.options.templateDir, templateName + self.meryl.options.templateExt);
    var src = null;
    try {
      src = fs.readFileSync(templatePath, __encoding);
    } catch (e) {
      throw 'template not found';
    }
    return src ? self.meryl.options.templateFunc(src, data) : null;
  }
  return this.end(render(templateName, ctx));
};

/*
 * Shorthand meryl functions for http methods
 */
['get', 'post', 'put', 'delete'].forEach(function (method) {
  Meryl.prototype[method] = function () {
    var args = Array.prototype.slice.call(arguments);
    args[0] = method.toUpperCase() + ' ' + args[0];
    return this.plug.apply(this, args);
  };
});
  
/*
 * Handle uncaught exceptions explicitly to prevent node exiting
 * current process. Exception stack trace is sent to stderr.
 */
process.on('uncaughtException', function (err) {
  sys.error(err instanceof Error ? err.stack : err);
});

/*
 * export Meryl as a pre-instantiated instance
 */
module.exports = new Meryl();
