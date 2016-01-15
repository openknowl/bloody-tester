'use strict';

const client = require('./client');

class Tester {
  constructor(host) {
    this.host = host ? Tester.parseHost(host) : null;
    this.ajax = false;
  }

  static parseHost(host) {
    if (typeof host === 'number') {
      return 'http://localhost:' + host;
    }

    if (!host.includes('://')) {
      return 'http://' + host;
    }

    return host;
  }

  setHost(host) {
    this.host = Tester.parseHost(host);
  }

  getURL(url) {
    if (this.host && url.startsWith('/')) {
      return this.host + url;
    }
    return url;
  }

  getHeader(header) {
    header = header || {};

    if (this.ajax) {
      header['X-Requested-With'] = 'XMLHttpRequest';
    }

    return header;
  }

  get(url, query, header) {
    return client.get(this.getURL(url), query, this.getHeader(header));
  }

  delete(url, query, header) {
    return client.delete(this.getURL(url), query, this.getHeader(header));
  }

  head(url, query, header) {
    return client.head(this.getURL(url), query, this.getHeader(header));
  }

  post(url, body, header) {
    return client.post(this.getURL(url), body, this.getHeader(header));
  }

  put(url, body, header) {
    return client.put(this.getURL(url), body, this.getHeader(header));
  }

  patch(url, body, header) {
    return client.patch(this.getURL(url), body, this.getHeader(header));
  }

  withAJAX() {
    this.ajax = true;
    return this;
  }
}

module.exports = Tester;
