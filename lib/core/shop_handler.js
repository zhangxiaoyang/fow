#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var logger = require('log4js').getLogger();
var util = require('../util/util.js');

var ShopHandler = module.exports = function(cwd, option, fow) {
  var shop = util.cleanstr(option);
  if(shop) {
    if(fs.existsSync(shop)) {
      logger.error('An old shop with this name is already here.');
      process.exit(1);
    }
    fse.copySync(path.join(fow.fowdir, 'startup'), shop);
  }
  else {
    logger.error('Invalid name');
    process.exit(1);
  }

  logger.info('Good! Go into it and create your first book.');
};
