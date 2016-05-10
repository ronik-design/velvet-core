'use strict';

const path = require('path');
const hoek = require('hoek');
const velvet = require('../index');

class Page extends velvet.Document {

  constructor(options) {
    options.type = 'pages';

    super(options);

    // Defaults
    const defaults = this.defaultValues;

    // Path bits
    const pathParts = path.parse(options.path);

    // Data store
    Object.assign(this.data, {
      title: this.data.title || pathParts.name,
      permalink: this.data.permalink || defaults.permalink || velvet.config.permalink
    });

    // Apply defaults
    this.data = hoek.applyToDefaults(defaults, this.data);

    // Extend
    this.extend(this.data);

    // Trigger hook
    this.triggerHooks('postInit');
  }
}

module.exports = Page;
