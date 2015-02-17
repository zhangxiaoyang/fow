#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var logger = require('log4js').getLogger();

var Init = module.exports = function(cwd, option, fow) {
  if(fow.workspace) {
    logger.error('Already in a fow directory');
    process.exit(1);
  }

  var dirname = option;

  if(!dirname) {
    logger.error('Missing parameter: Directory');
    process.exit(1);
  }

  fs.exists(dirname, function(exists) {
    if(exists) {
      logger.error('Cannot create directory: Directory exists.');
      process.exit(1);
    }

    fse.copy(path.join(fow.fowdir, 'startup'), dirname, {});
  });
};
