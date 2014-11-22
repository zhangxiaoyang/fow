#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

exports.cleanstr = function(string) {
  return string.replace(/ /g, '-').replace(/[^a-zA-Z0-9\-\+_]/g, '');
};

exports.getdatepath = function() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDay();

    var datepath = [
      year.toString(),
      month < 10 ? '0' + month : month.toString(),
      day < 10 ? '0' + day : day.toString()
    ].join('/');

    return datepath;
}
