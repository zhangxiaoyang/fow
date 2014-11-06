#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var events = require('events');
var util = require('util');

var Fow = module.exports = function() {
  this.bootstrap = function(cwd, args) {
    
    this.title = 'Focus On Writing';

    this.version = 'v0.0.1';

    this.cwd = cwd;

    this.args = (function() {
      return {
        command: args.slice(0, 1).toString().toLowerCase(),
        option: args.slice(1, 2).toString().toLowerCase()
      };
    })();

    this.usage = {
      f: '',
      o: '',
      w: ''
    };

    if(this.args.command in this.usage) {
      return this.emit(this.args.command, this.args.option);
    }
    else {
      return this.emit('h');
    }
  };

  this.on('f', function() {
    console.log('f');
  });

  this.on('o', function(option) {
    console.log('o: ' + option);
  });

  this.on('w', function() {
    console.log('w');
  });

  this.on('h', function() {
    console.log('help');
  });
}

util.inherits(Fow, events.EventEmitter)
