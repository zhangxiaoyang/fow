#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

exports.normfile = function(filename) {
  return filename.replace(/[^a-zA-Z\-]/g, '');
};
