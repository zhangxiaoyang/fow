#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var colors = require('colors');

exports.show = function() {
  console.log([
    '',
    'Focus On Writing v0.0.1'.bold.yellow,
    '',
    'Usage:',
    '  fow create [blog]    Setup your blog',
    '  fow write  [article] Create a new article',
    '  fow build            Generate site',
    '  fow help             Show this guide',
    ''
  ].join('\n'));
};
