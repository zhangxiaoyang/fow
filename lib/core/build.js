#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var path = require('path');
var logger = require('log4js').getLogger();
var yaml = require('js-yaml');
var util = require('../util/util.js');
var Render = require('../util/render.js');
var Meta = require('../util/meta.js');

function build(type, meta, render, option, fow) {
  var index = {};
  switch(type) {
    case 'index':
      index = meta.metaDesc;
      break;
    case 'archive':
      meta.metaDesc.forEach(function(item) {
        var year = util.formatDate(item.create_time, 'YYYY');
        year in index ? index[year].push(item) : index[year] = [item];
      });
      break;
    case 'category':
      meta.metaAsc.forEach(function(item) {
        var category = item.category;
        category in index ? index[category].push(item) : index[category] = [item];
      });
      break;
    case 'tag':
      meta.metaDesc.forEach(function(item) {
        item.tags.forEach(function(tag) {
          tag in index ? index[tag].push(item) : index[tag] = [item];
        });
      });
      break;
    case 'article':
      var m = option === '--force' ? meta.metaDesc : meta.diffMeta;
      m.forEach(function(item) {
        var articlePath = path.join(fow.categories, item.id + '.md');
        fs.readFile(articlePath, 'utf8', function(error, content) {
          logger.info('Building ' + articlePath);

          item.content = content;
          render.renders(item, 'article');
        });
      });
      index = null;
      break;
    case 'custom':
      fs.readdirSync(drafts).forEach(function(file) {
        var file = path.join(drafts, file);
        if(!fs.statSync(file).isDirectory() && file.search(/\.md$/) > -1) {
          fs.readFile(file, 'utf8', function(error, content) {
            logger.info('Building ' + file);

            var item = {
              content: content,
              id: file.split('/').slice(-1)[0].replace(/\.md$/, '')
            };
            render.renders(item, 'custom');
          });
        }
      });
      index = null;
      break;
  }

  return index;
}

var Build = module.exports = function(cwd, option, fow) {
  if(!fow.workspace) {
    logger.error('Not a fow directory');
    process.exit(1);
  }
  
  var render = new Render(fow.layouts, fow.config, fow.workspace);
  var meta = new Meta(fow);
  
  ['index', 'archive', 'category', 'tag', 'article', 'custom'].forEach(function(type) {
    var index = build(type, meta, render, option, fow);
    logger.info('Building ' + type);
    index && render.renders(index, type);
  });
};
