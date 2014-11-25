#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var logger = require('log4js').getLogger();
var util = require('../util/util.js');

var ChapterRunner = module.exports = function(cwd, option, fow) {
  if(!fow.workspace) {
    logger.error('Go into your shop first.');
    process.exit(1);
  }
  var inInvalidPath = !fs.existsSync(path.join(path.join(path.join(cwd, '..'), '..'), fow.warehouse));
  if(inInvalidPath) {
    logger.error('Go into your book first.');
    process.exit(1);
  }

  var chapter = util.cleanstr(option);
  if(!chapter) {
    logger.error('Invalid name');
    process.exit(1);
  }
  if(fs.existsSync(chapter)) {
    logger.error('An old chapter with this name is already here.');
    process.exit(1);
  }
  fse.mkdirpSync(path.join(chapter, 'images'));
  fs.writeFileSync(path.join(chapter, chapter+'.md'), '123', fow.encoding);

  logger.info('Perfect! Edit it and publish your site.');
};
