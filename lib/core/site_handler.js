#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var logger = require('log4js').getLogger();
var util = require('../util/util.js');

var SiteHandler = module.exports = function(cwd, option, fow) {
  if(!fow.workspace) {
    logger.error('Go into your shop first.');
    process.exit(1);
  }

  /*
  var book = util.cleanstr(option);
  if(!book) {
    logger.error('Invalid name');
    process.exit(1);
  }
  book = path.join(path.join(fow.workspace, 'books'), book);
  if(fs.existsSync(book)) {
    logger.error('An old book with this name is already here.');
    process.exit(1);
  }
  fse.mkdirpSync(book);

  logger.info('Cool! Go into this book to create your chapter.');
  */
};
