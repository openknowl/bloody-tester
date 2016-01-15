'use strict';

const client = require('./client');

class Tester {
  constructor(host) {
    this.host = host ? Tester.parseHost(host) : null;
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

  getFullURL(url) {
    if (this.host && url.startsWith('/')) {
      return this.host + url;
    }
    return url;
  }

  get(url, query, header) {
    return client.get(this.getFullURL(url), query, header);
  }

  delete(url, query, header) {
    return client.delete(this.getFullURL(url), query, header);
  }

  head(url, query, header) {
    return client.head(this.getFullURL(url), query, header);
  }

  post(url, body, header) {
    return client.post(this.getFullURL(url), body, header);
  }

  put(url, body, header) {
    return client.put(this.getFullURL(url), body, header);
  }

  patch(url, body, header) {
    return client.patch(this.getFullURL(url), body, header);
  }
}

module.exports = Tester;
