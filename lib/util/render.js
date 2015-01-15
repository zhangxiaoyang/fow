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

Render.prototype.renderIndex = function(filenames, layout, _this) {
  _this.config.chapters = []
  filenames.forEach(function(filename) {
    console.log('=='+filename)
    // Overrided marked
    var bookpath = filename.split('/').splice(-4).splice(0, 3).join('/');
    marked.InlineLexer.prototype.outputLink = function(cap, link) {
      if(link.href.indexOf('/') === -1) {
        link.href = '/' + bookpath + '/' + link.href;
        console.log(link.href)
      }
      var href = escape(link.href)
        , title = link.title ? escape(link.title) : null;

      return cap[0].charAt(0) !== '!'
        ? this.renderer.link(href, title, this.output(cap[1]))
        : this.renderer.image(href, title, escape(cap[1]));
    };

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

    _this.config.chapters.push({
      title: meta.title,
      date: moment(meta.date).format('ddd, DD MMM YYYY HH:mm:ss'),
      tags: meta.tags,
      content: marked(content)
    });
  });
  _this.config.filename = layout.filename;
  var html = ejs.render(layout.content, _this.config);
  return html;
}

Render.prototype.renderBook = function(bookpath, layout, _this) {
  var chapters = fs.readdirSync(bookpath);
  var _chapters = [];
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
          content = content.split(/^<!\s?--\s?more\s?--\s?>/m, 2)[0];
          date = moment(meta.date)
          _chapters.push([date, {
            title: meta.title,
            date: date.format('ddd, DD MMM YYYY HH:mm:ss'),
            tags: meta.tags,
            content: marked(content),
            path: chapterfile.split('/').slice(-3).slice(0, 2).join('/')
          }]);
        }
        catch(error){
          logger.error('Abort in ' + chapterfile);
          process.exit(1);
        }
      }
    }
  });


  _this.config.chapters = {};
  for(var i in _chapters) {
    var date = _chapters[i][0];
    var year = date.year();
    var chapter = _chapters[i][1];

    if(year in _chapters) {
      var flag = false;
      for(var j in _chapters[year]) {
        if(_this.config.chapters[year][j].date < chapter.date) {
          _this.config.chapters[year].splice(j, 0, chapter);
          flag = true;
          break;
        }
      }
      if(!flag)
          _this.config.chapters[year].push(chapter);
    }
    else {
      _this.config.chapters[year] = [chapter];
    }
  }

  // Sorted by year
  _this.config.years = Object.keys(_this.config.chapters).sort();
  _this.config.filename = layout.filename;
  var html = ejs.render(layout.content, _this.config);
  return html;
}

Render.prototype.renderBooks = function(filename) {
}

Render.prototype.renderChapter = function(filename, layout, _this) {
  // Overrided marked
  var bookpath = filename.split('/').splice(-4).splice(0, 3).join('/');
  marked.InlineLexer.prototype.outputLink = function(cap, link) {
    if(link.href.indexOf('/') === -1) {
      link.href = '/' + bookpath + '/' + link.href;
      console.log(link.href)
    }
    var href = escape(link.href)
      , title = link.title ? escape(link.title) : null;

    return cap[0].charAt(0) !== '!'
      ? this.renderer.link(href, title, this.output(cap[1]))
      : this.renderer.image(href, title, escape(cap[1]));
  };

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
