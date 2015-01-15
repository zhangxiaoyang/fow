#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var logger = require('log4js').getLogger();
var util = require('../util/util.js');
var Warehouse = require('../util/warehouse.js');
var Render = require('../util/render.js');
var yaml = require('js-yaml');
var connect = require('connect');

var getChapterFilePath = function(site, chapter) {
    return path.join(path.join(site, chapter.bookname), chapter.chaptername + '.html');
};
var getIndexFilePath = function(workspace) {
  return path.join(workspace, 'index.html');
};
var getBookFilePath = function(site, book) {
  return path.join(site, path.join(book, 'book.html'));
};
var getBookFolderPath = function(site, book) {
  return path.join(site, book);
};
/*
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
*/

var SiteHandler = module.exports = function(cwd, option, fow) {
  if(!fow.workspace) {
    logger.error('Go into your shop first.');
    process.exit(1);
  }

  var w1 = new Warehouse(fow.encoding);
  var w2 = new Warehouse(fow.encoding);
  if(option !== '--force') {
      w1.loads(path.join(fow.workspace, fow.warehouse));
  }
  w2.build(path.join(fow.workspace, 'books'));

  var diff_chapters = w2.diff(w1);
  var update_chapters = diff_chapters['update_chapters'];
  var delete_chapters = diff_chapters['delete_chapters'];
  var update_books = diff_chapters['update_books'];
  var delete_books = diff_chapters['delete_books'];

  var config = yaml.safeLoad(fs.readFileSync(path.join(fow.workspace, fow.config), fow.encoding));
  var site = path.join(fow.workspace, config.site.path);
  var render = new Render(
    path.join(fow.workspace, 'layouts'),
    config,
    fow.encoding
  );
  
  // Build chapter
  for(var id in update_chapters) {
    var chapter = update_chapters[id];
    logger.info('Update chapter ' + getChapterFilePath(site, chapter));
    fse.outputFileSync(
      getChapterFilePath(site, chapter),
      render.render(chapter.chapterpath, Render.CHAPTER),
      fow.encoding
    );
  }
  for(var id in delete_chapters) {
    var chapter = delete_chapters[id];
    logger.info('Delete chapter ' + getChapterFilePath(site, chapter));
    fse.removeSync(getChapterFilePath(site, chapter));
  }

  // Build book
  for(var book in update_books) {
    logger.info('Update book ' + getBookFilePath(site, book));
    fse.outputFileSync(
      getBookFilePath(site, book),
      render.render(update_books[book], Render.BOOK),
      fow.encoding
    );
  }

  // Build index
  var chapters = [];
  var count = 0;
  for(var id in update_chapters) {
    if(count >= 10) break;
    chapters.push(update_chapters[id].chapterpath);
    count++;
  }
  
  fse.outputFileSync(
    getIndexFilePath(fow.workspace),
    render.render(chapters, Render.INDEX),
    fow.encoding
  );

  /*
  for(var book in delete_books) {
    fse.removeSync(getBookFolderPath(site, book));
    fse.removeSync(getBookFilePath(site, book));
    logger.info('Delete book ' + getBookFilePath(site, book));
    logger.info('Delete book ' + getBookFolderPath(site, book));
  }
  */
  w2.dumps(path.join(fow.workspace, fow.warehouse));

  if(option === '--server') {
    connect.createServer(
      connect.static(fow.workspace)
    ).listen(fow.port);
    logger.info('Server started at http://127.0.0.1:' + fow.port);
  }
};
