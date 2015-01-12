#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var marked = require('marked');
var render = require('../util/render.js');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

marked.setOptions({
  gfm: true
});

var Render = module.exports = function(layoutsDir, config, encoding) {
  this.config = config;
  this.encoding = encoding;
  this.layouts = (function loadLayouts() {
    var layouts = {'index':'', 'book':'', 'books':'', 'chapter':'', 'chapters':''};
    for(var layout in layouts) {
      filename = path.join(layoutsDir, layout + '.ejs');
      layouts[layout] = {
        content: fs.readFileSync(filename, encoding),
        filename: filename
      };
    }
    return layouts;
  }());
};

Render.INDEX = 'index';
Render.BOOK = 'book';
Render.BOOKS = 'books';
Render.CHAPTER = 'chapter';
Render.CHAPTERS = 'chapters';

Render.prototype.renderIndex = function(filename) {
}

Render.prototype.renderBook = function(filename) {
}

Render.prototype.renderBooks = function(filename) {
}

Render.prototype.renderChapter = function(filename, layout, _this) {
  var content = fs.readFileSync(filename, _this.encoding);
  _this.config.content = marked(content);
  _this.config.filename = layout.filename;
  var html = ejs.render(layout.content, _this.config);
  return html;
}

Render.prototype.renderChapters = function(filename) {
}

Render.prototype.render = function(filename, layout) {
  return {
    'index': this.renderIndex,
    'book': this.renderBook,
    'books': this.renderBooks,
    'chapter': this.renderChapter,
    'chapters': this.renderChapters
  }[layout](filename, this.layouts[layout], this);
};
