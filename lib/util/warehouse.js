#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var path = require('path');

var Warehouse = module.exports = function(encoding) {
  this.encoding = encoding ? encoding : 'utf8';
};

var Warehouse = module.exports = function(warehouse, encoding) {
  this.encoding = encoding ? encoding : 'utf8';
  this.chapters = warehouse.chapters;
};

Warehouse.prototype.build = function(dir) {
  this.chapters = (function indexChapters() {
    var chapters = {};
    fs.readdirSync(dir).forEach(function(book) {
      var _book = path.join(dir, book);
      if(fs.statSync(_book).isDirectory()) {
        fs.readdirSync(_book).forEach(function(chapter) {
          if(fs.statSync(_book).isDirectory()) {
            var _chapter = path.join(_book, chapter);

            var chapter_md = path.join(_chapter, chapter+'.md');
            if(fs.existsSync(chapter_md)) {
              chapters[book + ':' + chapter] = {
                chaptername: chapter,
                chapterpath: chapter_md,
                bookname: book,
                bookpath: _book,
                mtime: fs.statSync(chapter_md).mtime,
              };
            }
          }
        });
      }
    });
    return chapters;
  }());
};

Warehouse.prototype.dumps = function(dumpsFile) {
  fs.writeFileSync(dumpsFile, JSON.stringify(this.chapters), this.encoding);
};

Warehouse.prototype.loads = function(jsonFile) {
  this.chapters = JSON.parse(fs.readFileSync(jsonFile, this.encoding));
};
