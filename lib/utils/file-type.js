'use strict';

const path = require('path');
const assert = require('assert');
const mime = require('mime');

const fileType = {};

fileType.isType = function (exts) {
  let extensions = exts;

  if (typeof exts === 'string') {
    extensions = exts.split(',');
  }

  assert(Array.isArray(extensions), 'Extensions must be a string or array');

  return function (filepath) {
    const extension = path.extname(filepath).substr(1);
    return extensions.indexOf(extension) > -1;
  };
};

fileType.isData = function (filepath) {
  return mime.lookup(filepath) === 'text/yaml';
};

fileType.isHtml = function (filepath) {
  return mime.lookup(filepath) === 'text/html';
};

fileType.isMarkdown = function (filepath) {
  return mime.lookup(filepath) === 'text/x-markdown';
};

fileType.isImage = function (filepath) {
  return mime.lookup(filepath).search(/^image\//) >= 0;
};

fileType.isScript = function (filepath) {
  const mimeType = mime.lookup(filepath);
  return ['application/javascript', 'text/jsx'].indexOf(mimeType) >= 0;
};

fileType.isStyle = function (filepath) {
  const mimeType = mime.lookup(filepath);
  return ['text/css', 'text/x-scss', 'text/x-sass'].indexOf(mimeType) >= 0;
};

module.exports = fileType;
