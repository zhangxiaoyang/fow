#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var marked = require('marked');
var render = require('../util/render.js');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var logger = require('log4js').getLogger();
var moment = require('moment');

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

Render.prototype.renderBook = function(bookpath, layout, _this) {
  _this.config.chapters = [];

  var chapters = fs.readdirSync(bookpath);
  chapters.forEach(function(chapter) {
    var chapterpath = path.join(bookpath, chapter);
    if(fs.statSync(chapterpath).isDirectory()){
      var chapterfile = path.join(chapterpath, chapter + '.md');
      if(fs.existsSync(chapterfile)) {
        var text = fs.readFileSync(chapterfile, _this.encoding);
        var meta = null;
        var content = null;
        try{
          meta = yaml.safeLoad(text.split(/^\s?---\s?/m, 2)[0]);
          content = text.split(/^\s?---\s?/m, 2)[1];
          _this.config.chapters.push({
            title: meta.title,
            date: moment(meta.date).format('ddd, DD MMM YYYY HH:mm:ss'),
            tags: meta.tags,
            content: marked(content)
          });
        }
        catch(error){
          logger.error('Abort in ' + chapterfile);
          process.exit(1);
        }
      }
    }
  });
  _this.config.filename = layout.filename;
  var html = ejs.render(layout.content, _this.config);
  return html;
}

Render.prototype.renderBooks = function(filename) {
}

Render.prototype.renderChapter = function(filename, layout, _this) {
  var text = fs.readFileSync(filename, _this.encoding);
  var meta = null;
  var content = null;
  try{
    meta = yaml.safeLoad(text.split(/^\s?---\s?/m, 2)[0]);
    content = text.split(/^\s?---\s?/m, 2)[1];
  }
  catch(error){
    logger.error('Abort in ' + filename);
    process.exit(1);
  }
  _this.config.filename = layout.filename;
  _this.config.chapter = {
    title: meta.title,
    date: moment(meta.date).format('ddd, DD MMM YYYY HH:mm:ss'),
    tags: meta.tags,
    content: marked(content)
  };
  var html = ejs.render(layout.content, _this.config);
  return html;
}

Render.prototype.renderChapters = function(filename, layout, _this) {
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
