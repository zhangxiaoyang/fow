#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var colors = require('colors');

var HelpRunner = module.exports = function(cwd, option, fow) {
  (function show_usage() {
    console.log([
      '',
      ('Focus On Writing v' + fow.version).bold.yellow,
      '',
      'Usage:',
      '  fow create [blog]    Setup your blog',
      '  fow write  [article] Create a new article',
      '  fow build            Generate site',
      '  fow help             Show this guide',
      ''
    ].join('\n'));
  }());
};

