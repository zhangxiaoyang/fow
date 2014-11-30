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
  var update_books = {};
  var delete_books = {};
  for(var id in warehouse.chapters) {
    if(!(id in this.chapters)) {
      var chapter = this.chapters[id];
      delete_chapters[id] = warehouse.chapters[id];
      delete_books[chapter.bookname] = chapter.bookpath;
    }
  }
  for(var id in this.chapters) {
    if(!(id in warehouse.chapters) || this.chapters[id].mtime > warehouse.chapters[id].mtime) {
        var chapter = this.chapters[id];
        update_chapters[id] = chapter;
        update_books[chapter.bookname] = chapter.bookpath;
    }

    var book = id.split(':')[0];
    if(book in delete_books && !(id in delete_chapters)) {
      delete delete_books[book];
    }
  }

  return {
    update_chapters: update_chapters,
    delete_chapters: delete_chapters,
    update_books: update_books,
    delete_books: delete_chapters
  };
};
