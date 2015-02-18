#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var util = require('../util/util.js');


var Meta = module.exports = function(fow) {
  this.lastBuildJson = path.join(fow.workspace, '.last_build.json');
  this.workspace = fow.workspace;
  this.categories = fow.categories;

  this.metaPath = fow.meta;
  this.meta = yaml.safeLoad(fs.readFileSync(this.metaPath));

  this.updateMeta();
  this.sortMeta();
};

Meta.prototype.updateMeta = function() {
  var lastBuild = {};
  try {
    lastBuild = require(this.lastBuildJson);
  }
  catch(e) {
  }
  var workspaceDir = this.workspace.split('/').slice(-1)[0];
  var lastBuildTime = workspaceDir in lastBuild ? util.loadDate(lastBuild[workspaceDir]) : -1;
  fs.writeFile(this.lastBuildJson, JSON.stringify(function(){var json = {}; json[workspaceDir] = new Date(); return json;}()));

  var newMeta = [];
  var diffMeta = [];
  this.meta.forEach(function(item) {
    var articlePath = path.join(this.categories, item.id + '.md');
    if(fs.existsSync(articlePath)) {
      item.create_time = util.formatDate(item.create_time);
      item.update_time = util.formatDate(item.update_time);

      var mtime = fs.statSync(articlePath).mtime;
      if(mtime > lastBuildTime) {
        item.update_time = util.formatDate(mtime);
        diffMeta.push(item);
      }
      newMeta.push(item);
    }
  });

  this.newMeta = newMeta;
  this.diffMeta = diffMeta;
  //fs.writeFile(this.metaPath, yaml.safeDump(newMeta).replace(/"/g, ''));
};

Meta.prototype.sortMeta = function() {
  this.metaAsc = this.meta.concat().sort(function(x, y) {
    return x.create_time < y.create_time ? -1 : 1;
  });
  
  this.metaDesc = this.meta.concat().sort(function(x, y) {
    return x.update_time > y.update_time ? -1 : 1;
  });
};
