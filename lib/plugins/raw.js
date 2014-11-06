#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var dir = require('../util/dir.js'),
    path = require('path'),
    logger = require('../util/logger.js');

var Raw = module.exports = function(basedir, callback) {
  this.path = path.join(basedir, 'raw');

  var _this = this;
  dir.create(this.path, function() {
    logger.info(_this.path + ' generated.');
    callback();
  });
};
