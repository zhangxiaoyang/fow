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

var Render = module.exports = function(templatesDir, config, encoding) {
  this.config = config;
  this.encoding = encoding;
  this.templates = (function loadTemplates() {
    var templates = {'index':'', 'book':'', 'books':'', 'chapter':'', 'chapters':''};
    for(var template in templates) {
      filename = path.join(templatesDir, template + '.ejs');
      templates[template] = {
        content: fs.readFileSync(filename, encoding),
        filename: filename
      };
    }
    return templates;
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

Render.prototype.renderChapter = function(filename, template, _this) {
  var content = fs.readFileSync(filename, _this.encoding);
  _this.config.content = marked(content);
  _this.config.filename = template.filename;
  var html = ejs.render(template.content, _this.config);
  return html;
}

Render.prototype.renderChapters = function(filename) {
}

Render.prototype.render = function(filename, template) {
  return {
    'index': this.renderIndex,
    'book': this.renderBook,
    'books': this.renderBooks,
    'chapter': this.renderChapter,
    'chapters': this.renderChapters
  }[template](filename, this.templates[template], this);
};
