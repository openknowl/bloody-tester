'use strict';

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
}

module.exports = Tester;
