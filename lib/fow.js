#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var path = require('path');
var logger = require('log4js').getLogger();
var fs = require('fs');

process.on('uncaughtException', function (error) {
  logger.error('Unexpected error: ' + error);
});

var Fow = module.exports = function(cwd, args) {
  this.title = 'Focus On Writing';
  this.version = require('../package.json').version;
  this.cwd = cwd;
  this.encoding = 'utf8';
  this.port = 8090;
  this.config = 'config.yml';
  this.fowdir = path.join(__dirname, '..');
  this.workspace = (function(cwd, config) {
    while(!fs.existsSync(path.join(cwd, config))) {
      if(cwd === '/') {
        return '';
      }
      cwd = path.join(cwd, '..');
    }
    return cwd;
  }(this.cwd, this.config));
  this.config = path.join(this.workspace, this.config);
  this.drafts = path.join(this.workspace, 'drafts');
  this.layouts = path.join(this.workspace, 'layouts');
  this.meta = path.join(this.drafts, 'meta.yml');
  this.categories = path.join(this.drafts, 'categories');
  this.args = {
    command: args.slice(0, 1).toString().toLowerCase(),
    option: args.slice(1, 2).toString().toLowerCase()
  };
  this.commands = {
    'init': 'init', 'i': 'init',
    'new': 'new', 'n': 'new',
    'build': 'build', 'b': 'build',
    'serve': 'serve', 's': 'serve',
    'help': 'help', 'h': 'help'
  };

  this.args.command = this.args.command in this.commands
    ? this.commands[this.args.command]
    : 'help';
  new require('./core/' + this.args.command + '.js')(this.cwd, this.args.option, this);
};
