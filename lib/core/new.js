#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var logger = require('log4js').getLogger();
var yaml = require('js-yaml');
var util = require('../util/util.js');

var New = module.exports = function(cwd, option, fow) {
  if(!fow.workspace) {
    logger.error('Not a fow directory');
    process.exit(1);
  }

  var categoryName = option.split('/')[0];
  var articleName = option.split('/')[1];

  if(!categoryName) {
    logger.error('Missing parameter: Category');
    process.exit(1);
  }
  if(!articleName) {
    logger.error('Missing parameter: Article');
    process.exit(1);
  }

  articleName = articleName.search(/\.md$/) > -1 ? articleName : articleName + '.md';
  var articlePath = path.join(fow.categories, categoryName + '/' + articleName);
  fs.exists(articlePath, function(exists) {
    if(exists) {
      logger.error('Cannot create article: Article exists');
      process.exit(1);
    }

    var imagePath = path.join(fow.categories, categoryName + '/' + 'images');
    fse.mkdirp(imagePath);
    fse.outputFileSync(articlePath, '');

    var article = [{
      id: categoryName + '/' + articleName.replace(/\.md$/, ''),
      title: articleName.replace(/\.md$/, ''),
      category: categoryName,
      tags: ['others'],
      create_time: util.formatDate(new Date()),
      update_time: util.formatDate(new Date()),
    }];
    fs.appendFile(fow.meta, yaml.safeDump(article).replace(/"/g, ''), function(){});
  });
};
