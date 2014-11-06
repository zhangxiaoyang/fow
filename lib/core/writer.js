#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs'),
    path = require('path'),
    dir = require('../util/dir.js'),
    logger = require('../util/logger.js'),
    async = require('async');

var Creator = module.exports = function(article) {
  this.title = article;
  this.date = new Date();
  this.path = [
    this.date.getFullYear().toString(),
    (function getMonth() {
      var m = this.date.getMonth()+1;
      return m < 10 ? '0'+m : m.toString();
    }()),
    (function getDay() {
      var d = this.date.getDay();
      return d < 10 ? '0'+d : d.toString();
    }()),
  ];

  this.init = (function() {
    var _path = '';
    async.eachSeries(this.path, function(p, callback) {
      _path = path.join(_path, p);
      fs.exists(_path, function(exists){
        exists || dir.create(_path, function(err) {
          return err
            ? logger.error(err)
            : logger.info('article folder ' + _path + ' created.'), callback();
        return callback();
        });
      });
    }, function(err) {
        return err
          ? logger.error(err)
          : logger.info(_path + ' created.');
    });
  }());
};

