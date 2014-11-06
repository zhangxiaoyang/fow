#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');

exports.create = function(dir, callback) {
  fs.exists(dir, function(exists) {
    return exists
      ? callback('Failed to create ' + dir + '. An old one found.')
      : fs.mkdir(dir, function(err) {
        return err 
          ? callback('Cannot create ' + dir + '. ' + err)
          : callback();
      }); 
  }); 
};
