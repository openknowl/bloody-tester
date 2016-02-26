'use strict';

const _ = require('lodash');
const client = require('./client');
const cookie = require('tough-cookie');
const Scene = require('./scene');

class Tester {
  constructor(host) {
    this.host = host ? Tester.parseHost(host) : null;
    this.ajax = false;

    this.cookieJar = new cookie.CookieJar();
    this.useCookie = true;

    this.scenes = [];
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

  disableCookie() {
    this.useCookie = false;
    return this;
  }

  createScene() {
    let newScene = new Scene();
    this.registerScene(newScene);
    return newScene;
  }

  registerScene(scene) {
    this.scenes.push(scene);
  }

  unregisterScene(sceneToUnregister) {
    this.scenes = this.scenes.filter(scene => scene !== sceneToUnregister);
  }

  destroyScene(scene) {
    return scene.cleanup()
      .then(() => this.unregisterScene(scene));
  }

  cleanup() {
    let clean = () => {
      let scene = _.last(this.scenes);

      if (_.isUndefined(scene)) {
        return Promise.resolve();
      }

      return this.destroyScene(scene)
        .then(() => clean());
    };

    return clean();
  }
}

['get', 'delete', 'head', 'post', 'put', 'patch'].forEach(method => {
  Tester.prototype[method] = function (url, data, header) {
    return this.sendRequest(method, url, data, header);
  };
});

module.exports = Tester;
