'use strict';

const path = require('path');
const moment = require('moment-timezone');
const parse5 = require('parse5');
const hoek = require('hoek');
const slug = require('slug');

const velvet = require('../index');

const TOKENS = Symbol.for('tokens');

class Post extends velvet.Document {

  constructor(options) {
    options.type = 'posts';

    super(options);

    // Path bits
    const pathParts = path.parse(this.path);

    // Defaults
    const defaults = this.defaultValues;

    // Date
    const dateRe = /^(\d{4}\-\d{2}\-\d{2})\-/;

    if (!this.data.date) {
      const fileDate = pathParts.name.match(dateRe);
      this.data.date = fileDate ? fileDate[1] : this.data.file_modified_time;
    }

    // Title
    const fileTitle = pathParts.name.replace(dateRe, '');

    // Data store
    Object.assign(this.data, {
      title: this.data.title || fileTitle,
      permalink: this.data.permalink || defaults.permalink || velvet.config.permalink,
      excerpt: null
    });

    // Apply defaults
    this.data = hoek.applyToDefaults(defaults, this.data);

    // Extend
    this.extend(this.data);

    // Permalink tokens
    Object.assign(this[TOKENS], {
      ':year': this.date.format('YYYY'),
      ':month': this.date.format('MM'),
      ':i_month': this.date.format('M'),
      ':day': this.date.format('DD'),
      ':i_day': this.date.format('D'),
      ':short_year': this.date.format('YY'),
      ':hour': this.date.format('HH'),
      ':minute': this.date.format('mm'),
      ':second': this.date.format('ss'),
      ':title': this.data.slug || fileTitle,
      ':slug': this.data.slug || slug(fileTitle)
    });

    // Trigger hook
    this.triggerHooks('postInit');
  }

  get date() {
    return this.data.date ? moment.tz(this.data.date, velvet.config.timezone) : null;
  }

  get future() {
    return this.date && this.date > moment.tz(new Date(), velvet.config.timezone);
  }

  get draft() {
    return Boolean(this.data.draft);
  }

  get excerpt() {
    if (this.data.excerpt !== null) {
      return this.data.excerpt;
    }

    let excerpt;

    const fragment = parse5.parseFragment(this.content);

    for (const node of fragment.childNodes) {
      if (node.tagName === 'p') {
        excerpt = node;
        break;
      }
    }

    this.data.excerpt = parse5.serialize(excerpt) || '';

    return this.data.excerpt;
  }
}

module.exports = Post;
