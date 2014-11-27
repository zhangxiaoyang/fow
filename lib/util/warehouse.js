#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var path = require('path');

var Warehouse = module.exports = function(encoding, warehouse) {
  this.encoding = encoding ? encoding : 'utf8';
  this.chapters = warehouse ? warehouse.chapters : {};
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
                content: fs.readFileSync(chapter_md, this.encoding),
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

Warehouse.prototype.diff = function(warehouse) {
  var update_chapters = {};
  var delete_chapters = {};
  for(var id in this.chapters) {
    if(!(id in warehouse.chapters) || this.chapters[id].mtime > warehouse.chapters[id].mtime) {
        update_chapters[id] = this.chapters[id];
    }
  }
  for(var id in warehouse.chapters) {
    if(!(id in this.chapters)) {
      delete_chapters[id] = warehouse.chapters[id];
    }
  }
  return {
    update_chapters: update_chapters,
    delete_chapters: delete_chapters
  };
};
