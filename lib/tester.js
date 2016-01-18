'use strict';

const _ = require('lodash');
const client = require('./client');
const cookie = require('tough-cookie');

class Tester {
  constructor(host) {
    this.host = host ? Tester.parseHost(host) : null;
    this.ajax = false;

    this.cookieJar = new cookie.CookieJar();
    this.useCookie = true;
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

  getHeader(url, header) {
    header = header || {};

    if (this.ajax) {
      header['X-Requested-With'] = 'XMLHttpRequest';
    }

    if (this.useCookie) {
      header.Cookie = this.cookieJar.getCookieStringSync(url);
    }

    return header;
  }

  sendRequest(method, url, data, header) {
    let fullURL = this.getURL(url);
    return client[method](fullURL, data, this.getHeader(fullURL, header))
      .then((res) => {
        if (this.useCookie && _.isArray(res.headers['set-cookie'])) {
          res.headers['set-cookie'].forEach((rawCookie) => {
            this.cookieJar.setCookieSync(rawCookie, fullURL);
          });
        }
        return res;
      });
  }

  withAJAX() {
    this.ajax = true;
    return this;
  }
}

['get', 'delete', 'head', 'post', 'put', 'patch'].forEach(method => {
  Tester.prototype[method] = function (url, data, header) {
    return this.sendRequest(method, url, data, header);
  };
});

module.exports = Tester;
