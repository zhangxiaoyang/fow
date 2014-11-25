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
      '  fow shop [shopname]       Set up a book shop which stores your books',
      '  fow book [bookname]       Create a book',
      '  fow chapter [chaptername] Create a chapter(run in a book)',
      '  fow site                  Publish books into a site',
      '  fow help                  Show this guide',
      ''
    ].join('\n'));
  }());
};

