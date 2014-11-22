#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var fse = require('fs-extra');
var logger = require('log4js').getLogger();
var util = require('../util/util.js');

var WriteRunner = module.exports = function(cwd, option, fow) {
  (function create_article() {
    var article = util.cleanstr(option);
    var articlepath = util.getdatepath() + '/' + article;
    if(!article) {
      logger.error('Invalid name');
      process.exit(1);
    }

    article += '.md';
    if(fs.existsSync(articlepath)) {
      logger.error('An old article with this name is already here.');
      process.exit(1);
    }
    fse.mkdirpSync(articlepath + '/rc');
    fse.writeFileSync(articlepath + '/' + article, 'xxxx');

    logger.info('Cool! Edit ' + articlepath + '/' + article);
  }());
};
