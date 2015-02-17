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
      '  fow [i]nit   [DIR_NAME]    Create a fow directory',
      '  fow [n]ew    [ARTICLE_ID]  Create an article',
      '  fow [b]uild                Generate static files',
      '  fow [s]erve                Preview blog on port 8090',
      '  fow [h]elp                 Show this guide',
      '',
      'Example:',
      '  fow init myblog',
      '  cd myblog',
      '  fow new learn/learn-nodejs',
      '  fow build',
      '  fow serve'
    ].join('\n'));
  }());
};

