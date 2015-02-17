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
      '  fow [i/init]   [DIR_NAME]    Create a fow directory',
      '  fow [n/new]    [ARTICLE_ID]  Create an article',
      '  fow [b/build]                Generate static files',
      '  fow [s/serve]                Preview blog on port 8090',
      '  fow [h/help]                 Show this guide',
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

