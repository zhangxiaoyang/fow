#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var colors = require('colors');

exports.info = function(msg) {
  console.log(':) '.bold.green + msg);
};

exports.error = function(msg) {
  console.log(':( '.bold.red + msg);
  process.exit(1);
};
