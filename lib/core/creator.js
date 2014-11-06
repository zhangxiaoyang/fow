#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs'),
    async = require('async'),
    raw = require('../plugins/raw.js'),
    theme = require('../plugins/theme.js'),
    site = require('../plugins/site.js'),
    logger = require('../util/logger.js'),
    dir = require('../util/dir.js'),
    async = require('async');

var Creator = module.exports = function(basedir) {
  this.basedir = basedir;
  this.plugins = [raw, theme, site];

  var funcs = [create_basedir, exec_plugins];
  this.init = (function() {
    async.eachSeries(funcs, function(func, callback) {
    
    }, function(err) {

    });
  }());
};

  dir.create(this.basedir, function(err) {
    return err
      ? logger.error(err)
      : logger.info(this.basedir + ' created.'),
        
        exec_plugins(this.basedir, this.plugins);
  });

var exec_plugins = function(basedir, plugins) {
  async.eachSeries(plugins, function(plugin, callback) {
    new plugin(basedir, callback);
  }, function(err) {
    return err
      ? logger.error(err)
      : logger.info(basedir + ' done. Go inside and run `fow write [article]` to write your first article.');
  });
};
