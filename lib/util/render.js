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
  this.templates = (function loadTemplates() {
    var templates = {'index':'', 'books':'', 'chapters':'', 'chapter':''};
    for(var template in templates) {
      templates[template] = fs.readFileSync(path.join(templatesDir, template + '.ejs'), encoding);
    }
    return templates;
  }());
};

Render.prototype.render = function(content, template) {
  console.log(this.config);
  this.config.content = marked(content);
  var html = ejs.render(this.templates[template], this.config);
  console.log(html)
  return html;
};
