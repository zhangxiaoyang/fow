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
  this.warehouse = path.join(this.cwd, 'fow.json');
  this.args = {
      command: args.slice(0, 1).toString().toLowerCase(),
      option: args.slice(1, 2).toString().toLowerCase()
  };
  this.commands = ['create', 'write', 'build', 'help'];

  var isInArray = this.commands.indexOf(this.args.command) > -1;
  if(!isInArray) {
    this.args.command = 'help';
  }

  var inInvalidPath = !fs.existsSync(this.warehouse);
  if(inInvalidPath) {
    logger.error('You are in invalid path.');
    process.exit(1);
  }
  new require('./core/' + this.args.command + '_runner.js')(this.cwd, this.args.option, this);
};
