var connect = require('connect');

// Boot file

// export a function accepting Meryl instance
module.exports = function (meryl) {
  
  meryl.options.templateExt = '.mt', // Default is '.jshtml'
  
  meryl.plug(connect.static("."), connect.logger());
};
