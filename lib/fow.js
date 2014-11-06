#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var events = require('events'),
    path = require('path'),
    usage = require('./util/usage.js'),
    logger = require('./util/logger.js'),
    normfile = require('./util/normalize.js').normfile;

var Fow = module.exports = function() {};
Fow.prototype.__proto__ = events.EventEmitter.prototype;

Fow.prototype.bootstrap = function(cwd, args) {
  this.title = 'Focus On Writing';
  this.version = 'v0.0.1';
  this.cwd = cwd;
  this.warehouse = path.join(this.cwd, 'fow.json');
  this.args = {
      command: args.slice(0, 1).toString().toLowerCase(),
      option: args.slice(1, 2).toString().toLowerCase()
  };
  this.commands = ['create', 'write', 'build', 'help'];

  var isInArray = this.commands.indexOf(this.args.command) > -1;
  return isInArray
    ? this.emit(this.args.command, this.args.option)
    : this.emit('help');
}

Fow.prototype
  .on('create', function(blog) {
    this.basedir = normfile(blog);
    return this.basedir
      ? new require('./core/creator.js')(this.basedir)
      : logger.error('Tell me your blog name. Only accept letter, number or underline.');
  })
  .on('write', function(article) {
    this.article = normfile(article);
    return this.article
      ? new require('./core/writer.js')(article)
      : logger.error('Tell me your article name');
  })
  .on('build', function() {
      return new require('./core/builder.js')();
  })
  .on('help', function() {
    return usage.show();
  });
