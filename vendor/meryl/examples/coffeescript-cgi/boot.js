/*!
 * Boot file
 */

module.exports = function (meryl) {
  meryl.options.templateExt = '.coffee';
  meryl.options.templateFunc = require('coffeekup').adapters.meryl;
};

