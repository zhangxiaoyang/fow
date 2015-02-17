#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var marked = require('marked');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var yaml = require('js-yaml');
var logger = require('log4js').getLogger();
var ejs = require('ejs');

ejs.filters.formatDate = function(obj) {
  return require('./util.js').formatDate(obj);
};

marked.InlineLexer.prototype.outputLink = function(cap, link) {
  if(link.href.search(/^http/) < 0) {
    link.href = path.join('/drafts/categories', link.href);
  }
  var href = link.href;
  var title = link.title ? escape(link.title) : null;
  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

var Render = module.exports = function(layouts, config, workspace) {
  this.layouts = function(type) {
    return path.join(layouts, type + '.ejs');
  };
  this.config = yaml.safeLoad(fs.readFileSync(config, 'utf8'));
  this.workspace = workspace;
};

Render.prototype.renders = function(index, type) {
  if(['index', 'archive', 'category', 'tag'].indexOf(type) < 0) {
    return this['render_' + type](index, type);
  }

  var config = this.config;
  config.filename = this.layouts(type);
  config.index = index;

  var html = ejs.render(fs.readFileSync(config.filename, 'utf8'), config);
  fs.writeFile(path.join(this.workspace, type + '.html'), html);
};

Render.prototype.render_article = function(item, type) {
  var config = this.config;
  config.filename = this.layouts(type);
  config.item = item;

  var content = marked(config.item.content);
  var array = content.split(/^<!--\s?more\s?-->/m);
  config.item.content = array.length > 1
    ? '<div class="article-abstract">' + array[0] + '</div>' + array.slice(1).join('')
    : content;
  var html = ejs.render(fs.readFileSync(config.filename, 'utf8'), config);
  var categoryPath = path.join(this.workspace, 'categories');
  fse.outputFile(path.join(categoryPath, config.item.id + '.html'), html);
};

Render.prototype.render_custom = function(item, type) {
  if(['index', 'archive', 'category', 'tag'].indexOf(item.id.toLowerCase()) > -1) {
    logger.error('Naming conflict with keywords: index, archive, category, tag');
    process.exit(1);
  }

  var config = this.config;
  config.filename = this.layouts(type);
  config.item = item;
  config.item.content = marked(config.item.content);

  var html = ejs.render(fs.readFileSync(config.filename, 'utf8'), config);
  fse.outputFile(path.join(this.workspace, config.item.id + '.html'), html);
};
