#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var logger = require('log4js').getLogger();
var marked = require('marked');
var util = require('../util/util.js');
var Warehouse = require('../util/warehouse.js');

var SiteHandler = module.exports = function(cwd, option, fow) {
  if(!fow.workspace) {
    logger.error('Go into your shop first.');
    process.exit(1);
  }

  var w1 = new Warehouse(fow.encoding);
  w1.loads(path.join(fow.workspace, fow.warehouse));

  var w2 = new Warehouse(fow.encoding);
  w2.build(path.join(fow.workspace, 'books'));

  var w3 = new Warehouse(w2.diff(w1));

  
/*
  var warehouse = (function buildWarehouse() {
    var warehouse = {};
    fs.readdirSync(books).forEach(function(book) {
      var _book = path.join(books, book);
      var _bookstat = fs.statSync(_book);
      if(_bookstat.isDirectory()) {
        warehouse[book] = {};
        fs.readdirSync(_book).forEach(function(chapter) {
          var _chapter = path.join(_book, chapter);
          var _chapterstat = fs.statSync(_chapter);
          var _chapter_md = path.join(_chapter, chapter + '.md');
          if(_chapterstat.isDirectory() && fs.existsSync(_chapter_md)) {
            warehouse[book][chapter] = {
              path: _chapter,
              mtime: _chapterstat.mtime,
              content: fs.readFileSync(_chapter_md, fow.encoding)
            };
          }
        });
      }
    });
    return warehouse;
  }());
  (function buildSite() {
    var site = path.join(fow.workspace, 'site');
    fse.mkdirpSync(site);
    for(var book in warehouse) {
      var _book = path.join(site, book);
      fse.mkdirpSync(_book);
      for(var chapter in warehouse[book]) {
        var html = marked(warehouse[book][chapter].content);
        fs.writeFileSync(path.join(_book, chapter) + '.html', html, fow.encoding);
      }
    }
  }());
*/
  logger.info('Done!');
};
