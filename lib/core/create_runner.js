#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var fse = require('fs-extra');
var logger = require('log4js').getLogger();
var util = require('../util/util.js');

var CreateRunner = module.exports = function(cwd, option, fow) {
  (function create_blog() {
    var blog = util.cleanstr(option);
    if(blog) {
      if(fs.existsSync(blog)) {
        logger.error('An old blog with this name is already here.');
        process.exit(1);
      }
      fse.copySync(__dirname + '/../../startup', blog);
    }
    else {
      logger.error('Invalid name');
      process.exit(1);
    }

    logger.info('Good! Go into it and create your first article.');
  }());
};
