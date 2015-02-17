#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var logger = require('log4js').getLogger();
var connect = require('connect');

var Serve = module.exports = function(cwd, option, fow) {
  if(!fow.workspace) {
    logger.error('Not a fow directory');
    process.exit(1);
  }

  var port = parseInt(option) ? parseInt(option) : fow.port;

  connect.createServer(
    connect.static(fow.workspace)
  ).listen(port);

  logger.info('Server started at http://127.0.0.1:' + port);
};
