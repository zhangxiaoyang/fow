#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var path = require('path');
var logger = require('log4js').getLogger();
var fs = require('fs');

/*
 * Fow class
 * 总控模块
 */
var Fow = module.exports = function(cwd, args) {
  this.title = 'Focus On Writing';
  this.version = require('../package.json').version;
  this.cwd = cwd;
  this.encoding = 'utf8';
  this.port = 8090;
  this.warehouse = 'fow.json';
  this.config = 'config.yml';
  this.fowdir = path.join(__dirname, '..');
  this.workspace = (function findShopDir(cwd, warehouse) {
    while(!fs.existsSync(path.join(cwd, warehouse))) {
      if(cwd === '/') {
        return null;
      }
      cwd = path.join(cwd, '..');
    }
    return cwd;
  }(this.cwd, this.warehouse));
  this.args = {
      command: args.slice(0, 1).toString().toLowerCase(),
      option: args.slice(1, 2).toString().toLowerCase()
  };
  this.commands = ['shop', 'book', 'chapter', 'site', 'help'];

  var isInArray = this.commands.indexOf(this.args.command) > -1;
  if(!isInArray) {
    this.args.command = 'help';
  }

  new require('./core/' + this.args.command + '_handler.js')(this.cwd, this.args.option, this);
};
