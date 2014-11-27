#!/usr/bin/env node
/* vim: set expandtab sw=2 ts=2 : */

var marked = require('marked');
var render = require('../util/render.js');

marked.setOptions({
  gfm: true
});

module.exports.HOME = 1;
module.exports.CHAPTER = 1;
module.exports.BOOK = 1;

module.exports = function(content, option) {
  if(option === module.exports.HOME) {
    return marked(content);
  }
  if(option === module.exports.BOOK) {
    return marked(content);
  }
  if(option === module.exports.CHAPTER) {
    return marked(content);
  }
};

