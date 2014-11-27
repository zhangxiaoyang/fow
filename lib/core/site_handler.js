#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var logger = require('log4js').getLogger();
var marked = require('marked');
var util = require('../util/util.js');
var Warehouse = require('../util/warehouse.js');

marked.setOptions({
  gfm: true
});

var getHtmlFilePath = function(site, chapter) {
    return path.join(path.join(site, chapter.bookname), chapter.chaptername + '.html');
}

var cleanEmptyFolders = function(dir) {
  fs.readdirSync(dir).forEach(function(folder) {
    var _folder = path.join(dir, folder);
    if(fs.statSync(_folder).isDirectory()) {
      if(!fs.readdirSync(_folder).length) {
        logger.info('Clean ' + _folder);
        fse.removeSync(_folder);
      }
    }
  });
};

var SiteHandler = module.exports = function(cwd, option, fow) {
  if(!fow.workspace) {
    logger.error('Go into your shop first.');
    process.exit(1);
  }

  var w1 = new Warehouse(fow.encoding);
  var w2 = new Warehouse(fow.encoding);
  switch(option) {
    case '--force':
      break;
    default:
      w1.loads(path.join(fow.workspace, fow.warehouse));
      break;
  }
  w2.build(path.join(fow.workspace, 'books'));

  var diff_chapters = w2.diff(w1);
  var update_chapters = diff_chapters['update_chapters'];
  var delete_chapters = diff_chapters['delete_chapters'];

  var site = path.join(fow.workspace, 'site');
  for(var id in update_chapters) {
    var chapter = update_chapters[id];
    logger.info('Update ' + getHtmlFilePath(site, chapter));
    fse.outputFileSync(getHtmlFilePath(site, chapter), marked(chapter.content), fow.encoding);
  }
  for(var id in delete_chapters) {
    var chapter = delete_chapters[id];
    logger.info('Delete ' + getHtmlFilePath(site, chapter));
    fse.removeSync(getHtmlFilePath(site, chapter));
  }
  cleanEmptyFolders(site);

  w2.dumps(path.join(fow.workspace, fow.warehouse));
};
