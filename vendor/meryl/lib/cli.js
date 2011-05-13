/*!
 * Meryl
 * Copyright(c) 2010 Kadir Pekel.
 * MIT Licensed
 */

/**
 * Module dependencies
 */
var meryl = require('./meryl'),
  fs = require('fs'),
  path = require('path');

/**
 * Load boot file
 */
var configDir = process.ARGV.length === 3 && process.ARGV[2];
if (configDir) {
  try {
    process.chdir(configDir);
  } catch (e) {
    throw 'Invalid root path';
  }
}

var configPath = path.join(process.cwd(), 'boot.js');

if (path.existsSync(configPath)) {
  var stats = fs.statSync(configPath);
  configPath = configPath.replace(/\.js$/, '');
  require(configPath)(meryl);
  console.log('Boot file loaded...');
}

/**
 * Start Engines
 */  
meryl.run();
console.log('Running Meryl...');
