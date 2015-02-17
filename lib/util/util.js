#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var moment = require('moment');

exports.formatDate = function(d, fmt) {
  if(!fmt) fmt = 'YYYY-MM-DD HH:mm:ss';
  return moment(d).format(fmt);
};

exports.loadDate = function(d) {
  return moment(d);
};
