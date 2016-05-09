'use strict';

const hoek = require('hoek');

class Velvet {

  init(options) {
    this.config = options.config;
    this.environment = options.environment || 'development';

    this.site = this.autoload('./lib/site');
    this.hooks = this.autoload('./lib/hooks');
    this.plugins = this.autoload('./lib/plugins');
    this.templateCache = this.autoload('./lib/template-cache');
    this.converter = this.autoload('./lib/converter');

    this.Data = require('./lib/data');
    this.Document = require('./lib/document');
    this.Page = require('./lib/page');
    this.Post = require('./lib/post');
    this.File = require('./lib/file');
    this.Image = require('./lib/image');
    this.ImageVariant = require('./lib/image-variant');
    this.Script = require('./lib/script');
    this.Style = require('./lib/style');
  }

  autoload(filepath) {
    const Ctor = require(filepath);
    return new Ctor({config: this.config});
  }

  getConfig(prop) {
    return hoek.reach(this.config, prop);
  }
}

module.exports = new Velvet();

module.exports.Velvet = Velvet;
