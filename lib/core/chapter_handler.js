#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var logger = require('log4js').getLogger();
var util = require('../util/util.js');

var ChapterRunner = module.exports = function(cwd, option, fow) {
  var inBook = cwd.match(path.join(fow.workspace, 'books') + '/[^/]+');
  if(!inBook) {
    logger.error('Go into your book first.');
    process.exit(1);
  }
  book = inBook[0];

  var chapter = util.cleanstr(option);
  if(!chapter) {
    logger.error('Invalid name');
    process.exit(1);
  }
  chapter_md = chapter + '.md';
  chapter = path.join(book, chapter);
  if(fs.existsSync(chapter)) {
    logger.error('An old chapter with this name is already here.');
    process.exit(1);
  }
  fse.mkdirpSync(path.join(chapter, 'resources'));
  fs.writeFileSync(path.join(chapter, chapter_md), 'test', fow.encoding);

  logger.info('Perfect! Edit it and publish your site.');
};
